from flask import jsonify, Blueprint, request
import flask_praetorian
import bson
from bson.objectid import ObjectId
from modelos.Horarios import Horarios

HorarioBP = Blueprint('horarios', __name__, url_prefix='/api/horario')

@HorarioBP.route('', methods=['GET'])
@flask_praetorian.auth_required
def get_all_horarios():
    try:
        output = Horarios.objects().to_json()
        return output, 200
    except Exception as e:
        return jsonify({"error": f"Imposible procesar la petición: {str(e)}"}), 500

@HorarioBP.route('/<horario_id>', methods=['GET'])
@flask_praetorian.auth_required
def get_one_horario(horario_id):
    try:
        horario = Horarios.objects.get(_id=ObjectId(horario_id))
        return horario.to_json(), 200
    except bson.errors.InvalidId:
        return jsonify({"error": "ID inválido"}), 400
    except Horarios.DoesNotExist:
        return jsonify({"error": "Horario no encontrado"}), 404
    except Exception as e:
        return jsonify({"error": f"Imposible procesar la petición: {str(e)}"}), 500

@HorarioBP.route('/<horario_id>', methods=['DELETE'])
@flask_praetorian.auth_required
def delete_horarios(horario_id):
    try:
        res = Horarios.objects(_id=ObjectId(horario_id)).delete()
        return jsonify({"message": "Horario eliminado"}), 200
    except bson.errors.InvalidId:
        return jsonify({"error": "ID inválido"}), 400
    except Exception as e:
        return jsonify({"error": f"Imposible eliminar el objeto: {str(e)}"}), 400