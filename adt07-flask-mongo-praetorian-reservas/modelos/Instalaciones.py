from mongoengine import Document, EmbeddedDocument, StringField, ObjectIdField

class Instalaciones(Document):
    _id = ObjectIdField() 
    nombre = StringField(required=True, unique=True)

class InstalacionEmbedded(EmbeddedDocument):
    _id = ObjectIdField()
    nombre = StringField(required=True)
