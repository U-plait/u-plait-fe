import api from './api';

/**
 * 새로운 모바일 요금제를 생성하는 API 함수
 * @param {object} planData - 백엔드 DTO(AdminMobileCreateRequest)와 일치하는 모바일 요금제 데이터 객체
 */
export const createMobilePlanAPI = async (planData) => {
  try {
    const response = await api.post('/admin/plan/mobile', planData);
    return response.data;
  } catch (error) {
    console.error("API Error: createMobilePlanAPI", error);
    throw error;
  }
};

/**
 * 새로운 IPTV 요금제를 생성하는 API 함수
 * @param {object} planData - 백엔드 DTO(AdminIPTVPlanCreateRequest)와 일치하는 IPTV 요금제 데이터 객체
 */
export const createIptvPlanAPI = async (planData) => {
    try {
      const response = await api.post('/admin/plan/iptv', planData);
      return response.data;
    } catch (error)      {
      console.error("API Error: createIptvPlanAPI", error);
      throw error;
    }
  };

/**
 * 새로운 인터넷 요금제를 생성하는 API 함수
 * @param {object} planData - 백엔드 DTO(AdminInternetPlanCreateRequest)와 일치하는 인터넷 요금제 데이터 객체
 */
export const createInternetPlanAPI = async (planData) => {
    try {
        const response = await api.post('/admin/plan/internet', planData);
        return response.data;
    } catch (error) {
        console.error("API Error: createInternetPlanAPI", error);
        throw error;
    }
};

/**
 * 모바일 요금제 목록을 조회하는 API 함수
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지당 항목 수
 */
export const getMobilePlansAPI = async (page = 0, size = 5) => {
    try {
        const response = await api.get(`/admin/plan/mobile?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("API Error: getMobilePlansAPI", error);
        throw error;
    }
};

/**
 * 인터넷 요금제 목록을 조회하는 API 함수
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지당 항목 수
 */
export const getInternetPlansAPI = async (page = 0, size = 5) => {
    try {
        const response = await api.get(`/admin/plan/internet?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("API Error: getInternetPlansAPI", error);
        throw error;
    }
};

/**
 * IPTV 요금제 목록을 조회하는 API 함수
 * @param {number} page - 조회할 페이지 번호 (0부터 시작)
 * @param {number} size - 페이지당 항목 수
 */
export const getIptvPlansAPI = async (page = 0, size = 5) => {
    try {
        const response = await api.get(`/admin/plan/iptv?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("API Error: getIptvPlansAPI", error);
        throw error;
    }
};

/**
 * 요금제 상세 정보를 조회하는 API 함수
 * @param {string} planType - 요금제 타입 (e.g., "MobilePlan")
 * @param {number} planId - 요금제 ID
 */
export const getPlanDetailAPI = async (planType, planId) => {
    try {
        const response = await api.get(`/admin/plan/${planType}/detail/${planId}`);
        return response.data;
    } catch (error) {
        console.error("API Error: getPlanDetailAPI", error);
        throw error;
    }
};

// 🚨🚨🚨 여기가 추가/수정된 부분입니다 🚨🚨🚨

/**
 * 모바일 요금제 정보를 수정하는 API 함수
 * @param {number} planId - 수정할 요금제의 ID
 * @param {object} planData - 수정할 데이터 (AdminMobilePlanUpdateRequest DTO와 일치)
 */
export const updateMobilePlanAPI = async (planId, planData) => {
    try {
        const response = await api.put(`/admin/plan/mobile/${planId}`, planData);
        return response.data;
    } catch (error) {
        console.error("API Error: updateMobilePlanAPI", error);
        throw error;
    }
};

/**
 * 인터넷 요금제 정보를 수정하는 API 함수
 * @param {number} planId - 수정할 요금제의 ID
 * @param {object} planData - 수정할 데이터 (AdminInternetPlanUpdateRequest DTO와 일치)
 */
export const updateInternetPlanAPI = async (planId, planData) => {
    try {
        const response = await api.put(`/admin/plan/internet/${planId}`, planData);
        return response.data;
    } catch (error) {
        console.error("API Error: updateInternetPlanAPI", error);
        throw error;
    }
};

/**
 * IPTV 요금제 정보를 수정하는 API 함수
 * @param {number} planId - 수정할 요금제의 ID
 * @param {object} planData - 수정할 데이터 (AdminIPTVPlanUpdateRequest DTO와 일치)
 */
export const updateIptvPlanAPI = async (planId, planData) => {
    try {
        const response = await api.put(`/admin/plan/iptv/${planId}`, planData);
        return response.data;
    } catch (error) {
        console.error("API Error: updateIptvPlanAPI", error);
        throw error;
    }
};

export const deletePlanAPI = async (planId) => {
    try {
        const response = await api.delete(`/admin/plan/${planId}`);
        return response.data;
    } catch (error) {
        console.error("API Error: deletePlanAPI", error);
        throw error;
    }
};

export const getMobilePlans = async () => {
    try {
        const response = await api.get('/plan/Cmobile'); // 경로 수정
        return response.data.data; // Assuming CommonResponse.success wraps data in 'data' field
    } catch (error) {
        console.error("Error fetching mobile plans:", error);
        throw error;
    }
};

export const getInternetPlans = async () => {
    try {
        const response = await api.get('/plan/Cinternet'); // 경로 수정
        return response.data.data;
    } catch (error) {
        console.error("Error fetching internet plans:", error);
        throw error;
    }
};

export const getIptvPlans = async () => {
    try {
        const response = await api.get('/plan/Ciptv'); // 경로 수정
        return response.data.data;
    } catch (error) {
        console.error("Error fetching IPTV plans:", error);
        throw error;
    }
};

export const comparePlans = async (planType, planIds) => {
    try {
        const response = await api.post(`/plan/compare/${planType}`, { planIds }); // 경로 수정
        return response.data.data;
    } catch (error) {
        console.error("Error comparing plans:", error);
        throw error;
    }
};