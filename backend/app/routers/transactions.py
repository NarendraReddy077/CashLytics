from fastapi import APIRouter, Depends, HTTPException, Query, status
from datetime import date
from typing import Optional
from app.schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    WeeklyReportResponse,
)
from app.dependencies import get_current_user
from app.services.transaction_service import TransactionService

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/", response_model=list[TransactionResponse])
async def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    user: dict = Depends(get_current_user),
):
    """List all transactions for the authenticated user."""
    return await TransactionService.get_all(user["id"], skip, limit)


@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate,
    user: dict = Depends(get_current_user),
):
    """Create a new transaction."""
    data = payload.model_dump()
    data["date"] = data["date"].isoformat()
    data["type"] = data["type"].value
    return await TransactionService.create(user["id"], data)


@router.get("/weekly-report", response_model=WeeklyReportResponse)
async def weekly_report(
    reference_date: Optional[date] = Query(None, description="Any date within the target week"),
    user: dict = Depends(get_current_user),
):
    """Get a weekly financial summary for the authenticated user."""
    return await TransactionService.get_weekly_report(user["id"], reference_date)


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: str,
    user: dict = Depends(get_current_user),
):
    """Get a single transaction by ID."""
    txn = await TransactionService.get_by_id(transaction_id, user["id"])
    if txn is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return txn


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: str,
    payload: TransactionUpdate,
    user: dict = Depends(get_current_user),
):
    """Update an existing transaction."""
    data = payload.model_dump(exclude_unset=True)
    if "date" in data and data["date"] is not None:
        data["date"] = data["date"].isoformat()
    if "type" in data and data["type"] is not None:
        data["type"] = data["type"].value

    txn = await TransactionService.update(transaction_id, user["id"], data)
    if txn is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return txn


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: str,
    user: dict = Depends(get_current_user),
):
    """Delete a transaction."""
    deleted = await TransactionService.delete(transaction_id, user["id"])
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
