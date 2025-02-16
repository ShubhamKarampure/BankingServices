# Compile GRPC
python -m grpc_tools.protoc --proto_path=. --python_out=. --grpc_python_out=. banking.proto

# Run GRPC Server
python server.py

# Run the uvicorn server
uvicorn main:app --reload --host 0.0.0.0 --port 8000