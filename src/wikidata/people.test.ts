import {fetchPeople} from './people'

it('should fetch wikidata', (done) => {
    fetchPeople().then((res) => {
        // tslint:disable:no-console
        Array.from(res.nodes.values()).map((d) => {
            console.log(d.node())
        });
        done()
    }).catch(done.fail);

}, 100000);
