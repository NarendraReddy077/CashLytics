from datetime import date, timedelta
from app.utils import get_supabase


class TransactionService:
    """Encapsulates all transaction-related database operations."""

    @staticmethod
    async def get_all(user_id: str, skip: int = 0, limit: int = 50) -> list[dict]:
        supabase = await get_supabase()
        response = (
            await supabase.table("transactions")
            .select("*")
            .eq("user_id", user_id)
            .order("date", desc=True)
            .range(skip, skip + limit - 1)
            .execute()
        )
        return response.data

    @staticmethod
    async def get_by_id(transaction_id: str, user_id: str) -> dict | None:
        supabase = await get_supabase()
        response = (
            await supabase.table("transactions")
            .select("*")
            .eq("id", transaction_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    @staticmethod
    async def create(user_id: str, data: dict) -> dict:
        supabase = await get_supabase()
        payload = {**data, "user_id": user_id}
        response = (
            await supabase.table("transactions").insert(payload).execute()
        )
        return response.data[0]

    @staticmethod
    async def update(transaction_id: str, user_id: str, data: dict) -> dict | None:
        supabase = await get_supabase()
        # Only include non-None fields
        update_data = {k: v for k, v in data.items() if v is not None}
        if not update_data:
            return await TransactionService.get_by_id(transaction_id, user_id)

        response = (
            await supabase.table("transactions")
            .update(update_data)
            .eq("id", transaction_id)
            .eq("user_id", user_id)
            .execute()
        )
        return response.data[0] if response.data else None

    @staticmethod
    async def delete(transaction_id: str, user_id: str) -> bool:
        supabase = await get_supabase()
        response = (
            await supabase.table("transactions")
            .delete()
            .eq("id", transaction_id)
            .eq("user_id", user_id)
            .execute()
        )
        return len(response.data) > 0

    @staticmethod
    async def get_weekly_report(user_id: str, reference_date: date | None = None) -> dict:
        """Generate a weekly financial report for the given week."""
        if reference_date is None:
            reference_date = date.today()

        # Calculate Monday–Sunday of the reference week
        start_of_week = reference_date - timedelta(days=reference_date.weekday())
        end_of_week = start_of_week + timedelta(days=6)

        supabase = await get_supabase()
        response = (
            await supabase.table("transactions")
            .select("*")
            .eq("user_id", user_id)
            .gte("date", start_of_week.isoformat())
            .lte("date", end_of_week.isoformat())
            .order("date")
            .execute()
        )

        transactions = response.data
        total_credits = sum(t["amount"] for t in transactions if t["type"] == "credit")
        total_debits = sum(t["amount"] for t in transactions if t["type"] == "debit")

        # Build a day-by-day breakdown for charting
        daily_map: dict[str, dict] = {}
        for i in range(7):
            d = (start_of_week + timedelta(days=i)).isoformat()
            daily_map[d] = {"date": d, "credits": 0.0, "debits": 0.0}

        for t in transactions:
            day = t["date"]
            if day in daily_map:
                if t["type"] == "credit":
                    daily_map[day]["credits"] += t["amount"]
                else:
                    daily_map[day]["debits"] += t["amount"]

        return {
            "total_credits": round(total_credits, 2),
            "total_debits": round(total_debits, 2),
            "net_balance": round(total_credits - total_debits, 2),
            "start_date": start_of_week.isoformat(),
            "end_date": end_of_week.isoformat(),
            "daily_breakdown": list(daily_map.values()),
        }
