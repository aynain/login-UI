import {HttpClient, json} from 'aurelia-fetch-client';
import {inject} from 'aurelia-framework';

@inject(HttpClient)
export class Api {
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    async getData(url: string) {
        return this.http.fetch(url)
            .then((response) => {
                return response
            })
    }

    async postData(url: string, data: object) {
        return this.http.fetch(url, {
            method: "post",
            body: json(data)
        })
            .then((response) => {
                return response
            })
    }

    async updateData(url: string, id: number, data: object) {
        return this.http.fetch(url + id, {
            method: 'PUT',
            body: json(data)
        })
            .then((response) => {
                return response
            })
    }

    async deleteData(url: string, id: number) {
        return this.http.fetch(url + id, {
            method: 'DELETE'
        })
            .then((response) => {
                return response
            })
    }
}
