from mongoengine import Document, EmbeddedDocument, StringField, ObjectIdField, EmbeddedDocumentField
from modelos.Instalaciones import InstalacionEmbedded

class HorarioEmbedded(EmbeddedDocument):
    _id = ObjectIdField()
    hora_inicio = StringField(required=True)
    hora_fin = StringField(required=True)
    instalacion = EmbeddedDocumentField(InstalacionEmbedded, required=True)

class Horarios(Document):
    _id = ObjectIdField()
    hora_inicio = StringField(required=True, unique=True)
    hora_fin = StringField(required=True, unique=True)
    instalacion = EmbeddedDocumentField(InstalacionEmbedded, required=True)
