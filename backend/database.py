from sqlalchemy import create_engine, Column, Integer, String, Text, Float, JSON
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), default="李同学")
    grade = Column(String(50), default="大二")
    major = Column(String(100), default="计算机科学与技术")
    current_courses = Column(JSON, default=list)
    completed_courses = Column(JSON, default=list)
    knowledge_base = Column(Integer, default=62)
    practice_ability = Column(Integer, default=58)
    cognitive_style = Column(JSON, default=list)
    weak_points = Column(JSON, default=list)
    learning_goals = Column(JSON, default=list)
    resource_preferences = Column(JSON, default=list)
    raw_data = Column(JSON, default=dict)


def init_db():
    Base.metadata.create_all(bind=engine)
