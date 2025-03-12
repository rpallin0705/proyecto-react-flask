from mongoengine import Document, DateField, ReferenceField, ObjectIdField
from modelos.Horarios import Horarios
from modelos.Usuarios import Usuarios

class Reservas(Document):
    _id = ObjectIdField() 
    fecha = DateField(required=True)
    horario = ReferenceField(Horarios, required=True, reverse_delete_rule=2)
    usuario = ReferenceField(Usuarios, required=True, reverse_delete_rule=2)