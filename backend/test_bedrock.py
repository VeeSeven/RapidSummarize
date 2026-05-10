import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

response = bedrock.converse(
    modelId="us.meta.llama4-scout-17b-instruct-v1:0",
    messages=[
        {"role": "user", "content": [{"text": "What is a PDF file?"}]}
    ]
)

print(response["output"]["message"]["content"][0]["text"])