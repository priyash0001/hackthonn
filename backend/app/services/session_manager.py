import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from ..models.schemas import SocraticMessage, BoundingBox, HintTier, SubjectArea

class SessionRecord:
    def __init__(
        self,
        session_id: str,
        problem_text: str,
        subject: SubjectArea,
        current_tier: HintTier = HintTier.SMALL_HINT
    ):
        self.session_id = session_id
        self.problem_text = problem_text
        self.subject = subject
        self.current_tier = current_tier
        self.messages: List[SocraticMessage] = []
        self.bounding_boxes: List[BoundingBox] = []
        self.is_mastered: bool = False
        self.created_at: str = datetime.now().isoformat()
        self.updated_at: str = datetime.now().isoformat()
        self.mistake_history: List[str] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "problem_text": self.problem_text,
            "subject": self.subject.value if hasattr(self.subject, 'value') else str(self.subject),
            "current_tier": int(self.current_tier.value) if hasattr(self.current_tier, 'value') else int(self.current_tier),
            "messages": [m.dict() if hasattr(m, 'dict') else m for m in self.messages],
            "bounding_boxes": [b.dict() if hasattr(b, 'dict') else b for b in self.bounding_boxes],
            "is_mastered": self.is_mastered,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "mistake_history": self.mistake_history
        }

class SessionManager:
    """In-memory session manager with analytics."""
    def __init__(self):
        self.sessions: Dict[str, SessionRecord] = {}

    def create_session(
        self,
        problem_text: str,
        subject: SubjectArea = SubjectArea.GENERAL,
        session_id: Optional[str] = None
    ) -> SessionRecord:
        s_id = session_id or str(uuid.uuid4())[:8]
        record = SessionRecord(s_id, problem_text, subject)
        self.sessions[s_id] = record
        return record

    def get_session(self, session_id: str) -> Optional[SessionRecord]:
        return self.sessions.get(session_id)

    def list_sessions(self) -> List[Dict[str, Any]]:
        return [s.to_dict() for s in sorted(self.sessions.values(), key=lambda x: x.updated_at, reverse=True)]

    def record_turn(
        self,
        session_id: str,
        user_msg: Optional[str],
        bot_guidance: str,
        probing_question: str,
        tier: HintTier,
        bounding_boxes: List[BoundingBox],
        identified_error_type: Optional[str] = None,
        is_mastered: bool = False
    ):
        session = self.get_session(session_id)
        if not session:
            session = self.create_session("Interactive Problem", SubjectArea.GENERAL, session_id=session_id)

        now = datetime.now().strftime("%H:%M")
        if user_msg:
            session.messages.append(SocraticMessage(role="user", content=user_msg, timestamp=now))
        
        session.messages.append(SocraticMessage(
            role="assistant",
            content=bot_guidance,
            probing_question=probing_question,
            tier=tier,
            identified_error_type=identified_error_type,
            timestamp=now
        ))
        
        session.current_tier = tier
        session.bounding_boxes = bounding_boxes
        session.is_mastered = session.is_mastered or is_mastered
        if identified_error_type and identified_error_type not in session.mistake_history:
            session.mistake_history.append(identified_error_type)
        session.updated_at = datetime.now().isoformat()

    def get_analytics(self) -> Dict[str, Any]:
        total = len(self.sessions)
        if total == 0:
            return {
                "total_sessions": 0,
                "mastery_rate": 0.0,
                "avg_tiers_reached": 1.0,
                "domain_distribution": {},
                "active_sessions_count": 0
            }

        mastered = sum(1 for s in self.sessions.values() if s.is_mastered)
        avg_tier = sum(int(s.current_tier.value if hasattr(s.current_tier, 'value') else s.current_tier) for s in self.sessions.values()) / total
        
        dist: Dict[str, int] = {}
        for s in self.sessions.values():
            subj = s.subject.value if hasattr(s.subject, 'value') else str(s.subject)
            dist[subj] = dist.get(subj, 0) + 1

        return {
            "total_sessions": total,
            "mastery_rate": round((mastered / total) * 100, 1),
            "avg_tiers_reached": round(avg_tier, 2),
            "domain_distribution": dist,
            "active_sessions_count": total
        }

session_manager = SessionManager()
