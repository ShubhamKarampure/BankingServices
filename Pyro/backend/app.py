from fastapi import FastAPI
import Pyro4

# Connect to Pyro4 server
banking_service = Pyro4.Proxy("PYRO:banking.service@localhost:9090")

app = FastAPI()

@app.get("/get_balance")
def get_balance():
    return {"balance": banking_service.get_balance()}

@app.post("/deposit/{amount}")
def deposit(amount: int):
    return {"message": banking_service.deposit(amount)}

@app.post("/withdraw/{amount}")
def withdraw(amount: int):
    return {"message": banking_service.withdraw(amount)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)
