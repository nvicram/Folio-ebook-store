"""
AWS Lambda Handler — Folio E-Book Store
Serves static assets from S3 or acts as an API proxy.
Runtime: Python 3.12
"""

import json
import boto3
import os
import mimetypes
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
BUCKET = os.environ.get("S3_BUCKET_NAME", "folio-ebook-store")


def handler(event, context):
    http_method = event.get("requestContext", {}).get("http", {}).get("method") \
                  or event.get("httpMethod", "GET")
    raw_path = event.get("rawPath") or event.get("path", "/")

    # Strip stage prefix e.g. /default/style.css → style.css
    path = raw_path.lstrip("/")
    if path.startswith("default/"):
        path = path[len("default/"):]
    path = path or "index.html"
    if path == "default":
        path = "index.html"

    # API Routes
    if path == "api/contact" and http_method == "POST":
        return handle_contact(event)

    if path == "api/checkout" and http_method == "POST":
        return handle_checkout(event)

    # Static Asset Serving
    return serve_static(path)


def serve_static(key):
    try:
        obj = s3.get_object(Bucket=BUCKET, Key=key)
        body = obj["Body"].read()
        content_type, _ = mimetypes.guess_type(key)
        content_type = content_type or "application/octet-stream"

        if content_type.startswith("text/") or content_type in ("application/javascript",):
            return {
                "statusCode": 200,
                "headers": {
                    "Content-Type": content_type,
                    "Cache-Control": "public, max-age=300",
                    "X-Frame-Options": "DENY",
                    "X-Content-Type-Options": "nosniff",
                },
                "body": body.decode("utf-8"),
            }

        import base64
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": content_type,
                "Cache-Control": "public, max-age=86400",
            },
            "body": base64.b64encode(body).decode("utf-8"),
            "isBase64Encoded": True,
        }

    except ClientError as e:
        code = e.response["Error"]["Code"]
        if code in ("NoSuchKey", "404"):
            return _json_response(404, {"error": f"Not found: {key}"})
        return _json_response(500, {"error": "Internal error fetching asset"})


def handle_contact(event):
    try:
        body = json.loads(event.get("body") or "{}")
        print(f"Contact form submission: {body}")
        return _json_response(200, {"message": "Message received. We'll reply within 24 hours."})
    except Exception as e:
        print(f"Contact error: {e}")
        return _json_response(500, {"error": "Failed to process contact form"})


def handle_checkout(event):
    try:
        body = json.loads(event.get("body") or "{}")
        cart = body.get("cart", [])
        total = sum(float(item.get("price", "0").replace("$", "")) for item in cart)
        print(f"Checkout: {len(cart)} items, total ${total:.2f}")
        return _json_response(200, {
            "message": "Checkout initiated",
            "items": len(cart),
            "total": f"${total:.2f}",
            "orderId": "ORD-DEMO-001",
        })
    except Exception as e:
        print(f"Checkout error: {e}")
        return _json_response(500, {"error": "Checkout failed"})


def _json_response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(body),
    }
