from app.database import Base
from sqlalchemy.orm import Mapped, mapped_column

class Job(Base):

    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column()
    company: Mapped[str] = mapped_column()
    role: Mapped[str] = mapped_column()
    status: Mapped[str] = mapped_column()
    notes:  Mapped[str] = mapped_column(nullable=True)
    salary: Mapped[str] = mapped_column(nullable=True)
    applied_date: Mapped[str] = mapped_column()
    followup_date: Mapped[str] = mapped_column(nullable=True)