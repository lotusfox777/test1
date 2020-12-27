import Cookies from 'js-cookie';
import { compose, flatten, pluck, uniqBy } from 'ramda';
import { API_ROOT } from '../constants/endpoint';

class CardGroupService {
  request = async (path, method = 'GET') => {
    var url = API_ROOT + path;

    let res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: 'Bearer ' + Cookies.get('_dplusToken'),
      },
    });

    let data = await res.json();

    return data;
  };

  getCardGroups = async ids => {
    const res = await Promise.all(ids.map(id => this.request(`/v1/cardGroup/${id}`)));

    return compose(
      uniqBy(card => card.id),
      flatten,
      pluck('cardInfos'),
      pluck('data'),
    )(res);
  };
}

export default new CardGroupService();
