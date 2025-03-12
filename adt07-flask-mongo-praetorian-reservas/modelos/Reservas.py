from mongoengine import Document, StringField, ObjectIdField, ReferenceField, EmbeddedDocumentField
from modelos.Horarios import HorarioEmbedded
from modelos.Usuarios import Usuarios

class Reservas(Document):
    _id = ObjectIdField()
    fecha = StringField(required=True)
    horario = EmbeddedDocumentField(HorarioEmbedded, required=True)
    usuario = ReferenceField(Usuarios, required=True)