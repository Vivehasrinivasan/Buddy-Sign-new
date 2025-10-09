"""Firebase client utilities for BuddySign backend."""
from __future__ import annotations

import json
import logging
import os
import threading
from typing import Any, Dict, Optional

import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger(__name__)


class FirebaseNotConfiguredError(RuntimeError):
    """Raised when Firebase credentials are not configured."""


_initialise_lock = threading.Lock()
_firestore_client: Optional[firestore.Client] = None
_user_repository: Optional["FirestoreUserRepository"] = None


def _build_service_account_dict() -> Optional[Dict[str, Any]]:
    """Create a service account dictionary from environment variables."""

    service_account_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")
    if service_account_path:
        service_account_path = service_account_path.strip()
        if service_account_path:
            if not os.path.isfile(service_account_path):
                raise FirebaseNotConfiguredError(
                    "FIREBASE_SERVICE_ACCOUNT_PATH does not point to a valid file"
                )
            with open(service_account_path, "r", encoding="utf-8") as file:
                return json.load(file)

    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_json:
        try:
            return json.loads(service_account_json)
        except json.JSONDecodeError as exc:
            raise FirebaseNotConfiguredError(
                "FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON"
            ) from exc

    required_fields = (
        "FIREBASE_PROJECT_ID",
        "FIREBASE_PRIVATE_KEY_ID",
        "FIREBASE_PRIVATE_KEY",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_CLIENT_ID",
    )

    if all(os.getenv(field) for field in required_fields):
        private_key = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
        return {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": private_key,
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv(
                "FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"
            ),
            "token_uri": os.getenv(
                "FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"
            ),
            "auth_provider_x509_cert_url": os.getenv(
                "FIREBASE_AUTH_PROVIDER_X509_CERT_URL",
                "https://www.googleapis.com/oauth2/v1/certs",
            ),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
        }

    return None


def _initialise_app() -> firebase_admin.App:
    """Initialise the firebase_admin application if needed."""
    with _initialise_lock:
        if firebase_admin._apps:
            return firebase_admin.get_app()

        service_account = _build_service_account_dict()
        if not service_account:
            raise FirebaseNotConfiguredError(
                "Firebase credentials are not configured. Provide either a service "
                "account file path, JSON string, or individual credential fields in the environment."
            )

        cred = credentials.Certificate(service_account)
        options: Dict[str, Any] = {}

        project_id = os.getenv("FIREBASE_PROJECT_ID")
        if project_id:
            options["projectId"] = project_id

        storage_bucket = os.getenv("FIREBASE_STORAGE_BUCKET")
        if storage_bucket:
            options["storageBucket"] = storage_bucket

        logger.info("Initialising Firebase app for project %s", project_id)
        return firebase_admin.initialize_app(cred, options or None)


def get_firestore_client() -> firestore.Client:
    """Return a singleton Firestore client instance."""
    global _firestore_client

    if _firestore_client is not None:
        return _firestore_client

    app = _initialise_app()
    database_id = os.getenv("FIRESTORE_DATABASE_ID", "(default)") or "(default)"

    if database_id != "(default)":
        logger.info("Requested Firestore database '%s'", database_id)

    try:
        if database_id != "(default)":
            _firestore_client = firestore.client(app=app, database=database_id)
        else:
            _firestore_client = firestore.client(app=app)
    except TypeError:
        if database_id != "(default)":
            logger.warning(
                "Installed firebase_admin version does not support custom Firestore database ids. "
                "Falling back to '(default)'."
            )
        _firestore_client = firestore.client(app=app)
    return _firestore_client


class FirestoreUserRepository:
    """Repository helper for reading/writing user data in Firestore."""

    def __init__(self, client: firestore.Client):
        self._collection = client.collection("users")

    @staticmethod
    def _doc_to_user(doc: firestore.DocumentSnapshot) -> Dict[str, Any]:
        data = doc.to_dict() or {}
        data["email"] = doc.id
        return data

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        doc = self._collection.document(email).get()
        if doc.exists:
            return self._doc_to_user(doc)
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        query = self._collection.where("id", "==", user_id).limit(1)
        for doc in query.stream():
            return self._doc_to_user(doc)
        return None

    def create_user(self, email: str, data: Dict[str, Any]) -> Dict[str, Any]:
        self._collection.document(email).set(data)
        return data

    def update_user(self, email: str, updates: Dict[str, Any]) -> None:
        self._collection.document(email).update(updates)


def get_user_repository() -> FirestoreUserRepository:
    """Return a singleton user repository."""
    global _user_repository

    if _user_repository is None:
        client = get_firestore_client()
        _user_repository = FirestoreUserRepository(client)

    return _user_repository