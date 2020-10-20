import Api from '@/services/Api'
export default {
    index(search) {
        return Api().get('equipments', {
            params: {
                search: search
            }
        })
    },
    show(equipmentId) {
        return Api().get('equipment/' + equipmentId)
    },
    post(equipment) {
        return Api().post('equipment', equipment)
    },
    put(equipment) {
        return Api().put('equipment/' + equipment.id, equipment)
    },
    delete(equipment) {
        return Api().delete('equipment/' + equipment.id, equipment)
    },
    frontIndex(search) {
        return Api().get('equipments/front', {
            params: {
                search: search
            }
        })
    },
}