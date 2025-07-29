from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Vote
from .serializers import VoteSerializer
from questions.models import Question
from answers.models import Answer

class VoteCreateView(generics.CreateAPIView):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        target_type = request.data.get('target_type')
        target_id = request.data.get('target_id')
        vote_type = request.data.get('vote_type')

        if not all([target_type, target_id, vote_type]):
            return Response({"error": "Missing target_type, target_id or vote_type."},
                            status=status.HTTP_400_BAD_REQUEST)

        # Get target model instance
        target = self._get_target_instance(target_type, target_id)
        if not target:
            return Response({"error": "Target not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check for existing vote
        existing_vote = Vote.objects.filter(
            user=user,
            target_type=target_type,
            target_id=target_id
        ).first()

        if existing_vote:
            if existing_vote.vote_type == vote_type:
                self._update_target_votes(target, vote_type, remove=True)
                existing_vote.delete()
                return Response({"message": "Vote removed."}, status=status.HTTP_204_NO_CONTENT)
            else:
                self._update_target_votes(target, existing_vote.vote_type, remove=True)
                self._update_target_votes(target, vote_type, remove=False)
                existing_vote.vote_type = vote_type
                existing_vote.save()
                return Response({"message": "Vote updated."}, status=status.HTTP_200_OK)

        # Create new vote
        vote = Vote.objects.create(
            user=user,
            target_type=target_type,
            target_id=target_id,
            vote_type=vote_type
        )
        self._update_target_votes(target, vote_type, remove=False)
        serializer = self.get_serializer(vote)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _get_target_instance(self, target_type, target_id):
        if target_type == 'question':
            return Question.objects.filter(question_id=target_id).first()
        elif target_type == 'answer':
            return Answer.objects.filter(answer_id=target_id).first()
        return None

    def _update_target_votes(self, target, vote_type, remove=False):
        field = 'upvotes' if vote_type == 'upvote' else 'downvotes'
        current = getattr(target, field, 0)
        setattr(target, field, max(0, current - 1) if remove else current + 1)
        target.save()
