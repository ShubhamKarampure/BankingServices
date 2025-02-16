from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import grpc
import banking_pb2
import banking_pb2_grpc

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request body
class AmountRequest(BaseModel):
    amount: int

# gRPC client setup
def get_grpc_client():
    channel = grpc.insecure_channel('localhost:50051')
    stub = banking_pb2_grpc.BankingServiceStub(channel)
    return stub

# Get Balance
@app.get('/balance')
async def get_balance():
    stub = get_grpc_client()
    try:
        response = stub.GetBalance(banking_pb2.Empty())
        return {"balance": response.balance}
    except grpc.RpcError as e:
        print(f"gRPC Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Deposit Money
@app.post('/deposit')
async def deposit(request: AmountRequest):
    stub = get_grpc_client()
    try:
        response = stub.PerformTransaction(
            banking_pb2.TransactionRequest(type="deposit", amount=request.amount)
        )
        return {
            "success": response.status == "success",
            "new_balance": response.new_balance
        }
    except grpc.RpcError as e:
        print(f"gRPC Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# Withdraw Money
@app.post('/withdraw')
async def withdraw(request: AmountRequest):
    stub = get_grpc_client()
    try:
        response = stub.PerformTransaction(
            banking_pb2.TransactionRequest(type="withdrawal", amount=request.amount)
        )
        return {
            "success": response.status == "success",
            "new_balance": response.new_balance
        }
    except grpc.RpcError as e:
        print(f"gRPC Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
