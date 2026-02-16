from pydantic import BaseModel, Field
from typing import Optional
from datetime import date as date_type
from enum import Enum


class TransactionType(str, Enum):
    credit = "credit"
    debit = "debit"


class TransactionCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Transaction amount (positive)")
    type: TransactionType
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    date: date_type


class TransactionUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[TransactionType] = None
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    date: Optional[date_type] = None


class TransactionResponse(BaseModel):
    id: str
    user_id: str
    amount: float
    type: TransactionType
    category: str
    description: Optional[str]
    date: str
    created_at: str


class WeeklyReportResponse(BaseModel):
    total_credits: float
    total_debits: float
    net_balance: float
    start_date: str
    end_date: str
    daily_breakdown: list[dict]
