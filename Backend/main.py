from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas
from uuid import uuid4

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "CRM API Running"}

@app.post("/api/tickets")
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):

    new_ticket = models.Ticket(
        ticket_id=f"TKT-{str(uuid4())[:8]}",
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at
    }

@app.get("/api/tickets")
def get_tickets(
    search: str = "",
    status: str = "",
    db: Session = Depends(get_db)
):

    query = db.query(models.Ticket)

    if search:
        query = query.filter(
            models.Ticket.customer_name.contains(search) |
            models.Ticket.customer_email.contains(search) |
            models.Ticket.subject.contains(search) |
            models.Ticket.description.contains(search)
        )

    if status:
        query = query.filter(models.Ticket.status == status)

    tickets = query.all()

    return tickets

@app.put("/api/tickets/{ticket_id}")
def update_ticket(
    ticket_id: str,
    status: str,
    db: Session = Depends(get_db)
):

    ticket = db.query(models.Ticket).filter(
        models.Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return {"error": "Ticket not found"}

    ticket.status = status

    db.commit()

    return {
        "success": True,
        "updated_status": ticket.status
    }