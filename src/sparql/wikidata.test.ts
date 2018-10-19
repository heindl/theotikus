import {fetchPeople} from './wikidata'

it('should fetch wikidata', (done) => {
    fetchPeople().then((res) => {
        // tslint:disable:no-console
        // console.log("_res", res);
        done()
    }).catch(done.fail);

}, 100000);
