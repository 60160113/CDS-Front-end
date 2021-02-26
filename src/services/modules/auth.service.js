import ApiRequest from '../api_request'

class AuthService extends ApiRequest {
  async login (request) {
    const {data} = await this.post('ums_user/login',request)
    return data
  }
}

export default AuthService