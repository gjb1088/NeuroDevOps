FROM python:3.11-slim

WORKDIR /app

# Install curl for debugging
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY app.py .

RUN pip install requests

CMD ["python", "app.py"]
