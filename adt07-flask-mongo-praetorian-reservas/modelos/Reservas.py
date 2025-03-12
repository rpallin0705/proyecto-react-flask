from mongoengine import Document, StringField, ObjectIdField, EmbeddedDocumentField
from modelos.Horarios import HorarioEmbedded
from modelos.Usuarios import UsuarioEmbedded

class Reservas(Document):
    _id = ObjectIdField()
    fecha = StringField(required=True)
    horario = EmbeddedDocumentField(HorarioEmbedded, required=True)
    usuario = EmbeddedDocumentField(UsuarioEmbedded, required=True)