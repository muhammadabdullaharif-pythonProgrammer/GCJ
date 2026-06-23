from django.db import models
from django.conf import settings


class ChatbotLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chatbot_logs',
        db_index=True
    )
    session_id = models.CharField(max_length=255, db_index=True)
    message = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'chatbot_logs_new'
        ordering = ['-created_at']

    def __str__(self):
        return f"Session {self.session_id} - User {self.user}"
