from flask import Blueprint, request, jsonify
import flask_praetorian
from bson import ObjectId
from modelos.Reservas import Reservas
from modelos.Horarios import Horarios, HorarioEmbedded

ReservaBP = Blueprint('reservas', __name__, url_prefix='/api/reserva')

@ReservaBP.route('', methods=['GET'])
@flask_praetorian.auth_required
def get_user_reservas():
    try:
        current_user = flask_praetorian.current_user()
        reservas = Reservas.objects(usuario=current_user._id)
        return reservas.to_json(), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ReservaBP.route('/<_id>', methods=['GET'])
@flask_praetorian.auth_required
def get_reserva_by_id(_id):
    try:
        current_user = flask_praetorian.current_user()
        reserva = Reservas.objects(_id=ObjectId(_id), usuario=current_user._id).first()
        if not reserva:
            return jsonify({"error": "Reserva no encontrada o sin permisos"}), 404
        return reserva.to_json(), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener reserva: {str(e)}"}), 500

@ReservaBP.route('', methods=['POST'])
@flask_praetorian.auth_required
def save_reserva():
    try:
        data = request.get_json()
        current_user = flask_praetorian.current_user()

        horario = Horarios.objects(_id=ObjectId(data["horario"])).first()
        if not horario:
            return jsonify({"error": "Horario no encontrado"}), 400

        horario_embedded = HorarioEmbedded(
            _id=horario._id,
            hora_inicio=horario.hora_inicio,
            hora_fin=horario.hora_fin,
            instalacion=horario.instalacion
        )

        reserva = Reservas(
            fecha=data["fecha"],
            horario=horario_embedded,
            usuario=current_user._id
        ).save()

        return jsonify({"message": "Reserva creada", "_id": str(reserva.id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

from bson import ObjectId, errors

@ReservaBP.route('/<reserva_id>', methods=['DELETE'])
@flask_praetorian.auth_required
def delete_reserva(reserva_id):
    try:
        res = Reservas.objects(_id=ObjectId(reserva_id)).delete()
        return jsonify({"message": "Reserva eliminada correctamente"}), 200
    except errors.InvalidId:
        return jsonify({"error": "ID inválido"}), 400
    except Exception as e:
        return jsonify({"error": f"Error al eliminar reserva: {str(e)}"}), 500


@ReservaBP.route('/<_id>', methods=['PUT'])
@flask_praetorian.auth_required
def update_reserva(_id):
    try:
        data = request.get_json()
        current_user = flask_praetorian.current_user()

        reserva = Reservas.objects(_id=ObjectId(_id), usuario=current_user._id).first()
        if not reserva:
            return jsonify({"error": "Reserva no encontrada o sin permisos"}), 404

        horario = Horarios.objects(_id=ObjectId(data["horario"])).first()
        if not horario:
            return jsonify({"error": "Horario no encontrado"}), 400

        horario_embedded = HorarioEmbedded(
            _id=horario._id,
            hora_inicio=horario.hora_inicio,
            hora_fin=horario.hora_fin,
            instalacion=horario.instalacion
        )

        reserva.fecha = data["fecha"]
        reserva.horario = horario_embedded
        reserva.save()

        return jsonify({"message": "Reserva actualizada correctamente"}), 200
    except Exception as e:
        return jsonify({"error": f"Error al actualizar reserva: {str(e)}"}), 500