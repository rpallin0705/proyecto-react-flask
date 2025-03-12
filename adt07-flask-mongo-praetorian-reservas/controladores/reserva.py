from flask import Blueprint, request
import flask_praetorian
from bson import ObjectId
from modelos.Reservas import Reservas
from modelos.Horarios import Horarios
from modelos.Usuarios import Usuarios, UsuarioEmbedded

ReservaBP = Blueprint('reservas', __name__, url_prefix='/api/reserva')

@ReservaBP.route('', methods=['GET'])
@flask_praetorian.auth_required
def get_all_reservas():
    try:
        reservas = Reservas.objects()
        for reserva in reservas:
            if reserva.usuario:
                reserva.usuario.hashed_password = None 
        
        return reservas.to_json(), 200

    except Exception as e:
        return {"error": f"Imposible procesar la petición: {str(e)}"}, 500

@ReservaBP.route('<reserva_id>', methods=['GET'])
@flask_praetorian.auth_required
def get_one_reserva(reserva_id):
    try:
        reserva = Reservas.objects(_id=ObjectId(reserva_id)).first()
        if not reserva:
            return {"error": "Reserva no encontrada"}, 404

        if reserva.usuario:
            reserva.usuario.hashed_password = None

        return reserva.to_json(), 200

    except Exception as e:
        return {"error": f"Imposible procesar la petición: {str(e)}"}, 500

@ReservaBP.route('', methods=['POST'])
@flask_praetorian.auth_required
def save_reserva():
    try:
        data = request.get_json()

        current_user = flask_praetorian.current_user()
        usuario = UsuarioEmbedded(
            _id=current_user._id,
            username=current_user.username,
            email=current_user.email,
            roles=current_user.roles,
            is_active=current_user.is_active
        )

        horario = Horarios.objects(_id=ObjectId(data["horario"])).first()
        if not horario:
            return {"error": "Horario no encontrado"}, 400

        reserva = Reservas(
            fecha=data["fecha"],
            horario=horario,
            usuario=usuario
        ).save()

        return reserva.to_mongo(), 201
    except Exception as e:
        return {"error": str(e)}, 400

@ReservaBP.route('<reserva_id>', methods=['PUT'])
@flask_praetorian.auth_required
def update_reserva(reserva_id):
    try:
        data = request.get_json()
        update_data = {}

        if "fecha" in data:
            update_data["set__fecha"] = data["fecha"]

        if "horario" in data:
            horario = Horarios.objects(_id=ObjectId(data["horario"])).first()
            if horario:
                update_data["set__horario"] = horario
            else:
                return {"error": "Horario no válido"}, 400

        res = Reservas.objects(_id=ObjectId(reserva_id)).update(**update_data)
        return {"message": "Reserva actualizada"}, 200 if res else {"error": "Reserva no encontrada"}, 404

    except Exception as e:
        return {"error": str(e)}, 400


@ReservaBP.route('<reserva_id>', methods=['DELETE'])
@flask_praetorian.auth_required
def delete_reserva(reserva_id):
    try:
        res = Reservas.objects(_id=ObjectId(reserva_id)).delete()
        return {"message": "Reserva eliminada"}, 200 if res else {"error": "Reserva no encontrada"}, 404

    except Exception as e:
        return {"error": f"Imposible eliminar la reserva: {str(e)}"}, 400
