class Vacation {
    constructor(type) {
        this.type = type;
        this.locations = []
    }

    addLocation(country, length) {
        this.locations.push(new location(country, length));
    }
}

class Location {
    constructor(country, length) {
        this.country = country;
        this.length = length;
    }
}

class VacationService {
    static url = 'https://apimocha.com/vacationideas/example';

    static getAllVacations() {
        return $.get(this.url);
    }

    static getVacation(id) {
        return $.get(this.url + `/$(id)`);
    }

    static createVacation(Vacation) {
        return $.post(this.url, vacation);
    }

    static updateVacation(vacation) {
        return $.ajax({
            url: this.url + `/${vacation._id}`,
            dataType: 'json',
            data: JSON.stringify(vacation),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteVacation(id) {
        return $.ajax({
            url: this.url + `/$(id)`,
            type: 'DELETE'
        })
    }

}

class DOMManager {
    static vacations;

    static getAllVacations() {
        VacationService.getVacations().then(vacations => this.render(vacations));
    }

    static createVacation(type) {
        VacationService.createVacation(new vacation(type))
        .then(() => {
            return VacationService.getAllVacations();
        })
        .then((vacations) => this.render(vacations));
    }

    static deleteVacation(id) {
    VacationService.deleteVacation(id)
    .then(() => {
        return VacationService.getAllVacations();
    })
    .then((vacations) => this.render(vacations));
   } 


    static render(vacations) {
        this.vacations = vacations;
        $('#app').empty();
        for (let vacation of vacations) {
            $('#app').prepend(
                `<div id="$(vacation._id)" class="card">
                <div class="card-header">
                <h2>$(vacation.type)</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteVacation('$(vacation._id')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                     <div class="row">
                       <div class="col-sm">
                        <input type="text" id="$(vacation._id)-location-name" class="form-control" placeholder="Vacation Name">
                   </div>
                   <div class="col-sm">
                    <input type="text" id="$(vacation._id)-location-length" class="form-control" placeholder="Vacation Length">
                     </div>
                   </div>
                    <button id="$(vacation._id)-new-location" onclick="DOMManager.addLocation('$(house._id)')" class="btn btn-info">Add</button>
                </div>
                </div>
                </div><br>`
                
            );

            for(let location of vacation.locations) {
                $(`#$(vacation._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${location._id}"><strong>Name: </strong> ${location.name} </span>
                    <span id="length-${location._id}"><strong>Length: </strong> ${location.length} </span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteLocation('${vacation._id}', '${location._id}')">Delete Location</button>`
                );
            }
        }
    }
}

    $('#create-new-vacation').click(() => {
        DOMManager.createVacation($('#vacation-ideas-name').val());
        $('#vacation-ideas-name').val('');
    });


DOMManager.getAllVacations();


