import axiosCore from 'axios'
import axios from '../client'

async function request(
    method,
    url,
    data = null,
    config = null,
    ...expectedStatuses
) {
    if (expectedStatuses.length === 0) {
        expectedStatuses = [axiosCore.HttpStatusCode.Ok]
    }
    const args = data ? [url, data, config] : [url, config]
    const response = await axios[method](...args).catch(error => error)
    if (expectedStatuses.includes(response.status)) {
        return {
            success: true,
            data: response.data
        }
    } else {
        return {
            success: false,
            data: response.response.data
        }
    }
}

export {request}
