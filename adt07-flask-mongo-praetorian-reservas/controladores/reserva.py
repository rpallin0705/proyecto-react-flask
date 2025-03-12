from flask import jsonify, Blueprint, request
import flask_praetorian
from bson import ObjectId
from modelos.Reservas import Reservas
from modelos.Horarios import Horarios
from modelos.Usuarios import Usuarios

ReservaBP = Blueprint('reservas', __name__, url_prefix='/api/reserva')

@ReservaBP.route('', methods=['GET'])
@flask_praetorian.auth_required
def get_all_reservas():
    try: 
        output = Reservas.objects().to_json()
        return output, 200
    except:
        return jsonify({"error": "Imposible procesar la petición"}), 500

@ReservaBP.route('<reserva_id>', methods=['GET'])
@flask_praetorian.auth_required
def get_one_reserva(reserva_id):
    try: 
        reserva = Reservas.objects(_id=reserva_id).first()  
        if reserva:
            return (reserva.to_json()), 200 
        return jsonify({"error": "Reserva no encontrada"}), 404
    except:
        return jsonify({"error": "Imposible procesar la petición"}), 500


@ReservaBP.route('', methods=['POST'])
@flask_praetorian.auth_required
def save_reserva():
    try: 
        data = request.get_json()
        usuario = Usuarios.objects(_id=ObjectId(data["usuario"])).first()
        horario = Horarios.objects(_id=ObjectId(data["horario"])).first()

        if not usuario or not horario:
            return jsonify({"error": "Usuario u Horario no válido"}), 400

        reserva = Reservas(
            fecha=data["fecha"],
            usuario=usuario,
            horario=horario
        ).save()
        return jsonify(reserva.to_mongo()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@ReservaBP.route('<reserva_id>', methods=['PUT'])
@flask_praetorian.auth_required
def update_reserva(reserva_id):
    try: 
        data = request.get_json()
        update_data = {}

        if "fecha" in data:
            update_data["set__fecha"] = data["fecha"]
        
        if "usuario" in data:
            usuario = Usuarios.objects(_id=ObjectId(data["usuario"])).first()
            if usuario:
                update_data["set__usuario"] = usuario
            else:
                return jsonify({"error": "Usuario no válido"}), 400

        if "horario" in data:
            horario = Horarios.objects(_id=ObjectId(data["horario"])).first()
            if horario:
                update_data["set__horario"] = horario
            else:
                return jsonify({"error": "Horario no válido"}), 400

        res = Reservas.objects(_id=ObjectId(reserva_id)).update(**update_data)
        return jsonify({"message": "Reserva actualizada"}), 200 if res else jsonify({"error": "Reserva no encontrada"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@ReservaBP.route('<reserva_id>', methods=['DELETE'])
@flask_praetorian.auth_required
def delete_reserva(reserva_id):
    try: 
        res = Reservas.objects(_id=ObjectId(reserva_id)).delete()
    except Exception as e:
        return jsonify('{"error": "Imposible actualizar el objeto"}'), 400
    return jsonify(res), 201
