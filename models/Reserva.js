class Reserva {
    constructor(id, idImovel, idUsuario, dataCheckIn, dataCheckOut, valorTotal, status, numeroHospedes) {
        this.id = id; 
        this.idImovel = idImovel; 
        this.idUsuario = idUsuario; 
        this.dataCheckIn = dataCheckIn; 
        this.dataCheckOut = dataCheckOut; 
        this.valorTotal = valorTotal;
        this.status = status; 
        this.numeroHospedes = numeroHospedes;
        this.dataCriacao = new Date(); 
    }

    static build(json) {
        return new Reserva(
            json.id,
            json.idImovel,
            json.idUsuario,
            json.dataCheckIn ? new Date(json.dataCheckIn) : undefined,
            json.dataCheckOut ? new Date(json.dataCheckOut) : undefined,
            json.valorTotal,
            json.status,
            json.numeroHospedes
        );
    }
}

export default Reserva;