const cities = require("../resources/cities.json");
const all = require("../resources/standardData.json");
const stores = require("../resources/storeLocation.json");
const axios = require("axios");
var stringSimilarity = require("string-similarity");
const { apiCallerDelivery } = require("./apiCaller");

module.exports.GHNcreateOrder = async function GHNcreateOrder(
  name,
  phone,
  address,
  quantity,
  serviceTypeId,
  serviceId,
  price
) {
  try {
    const addressId = await GHNgetAddressCode(address);
    const response = await apiCallerDelivery(
      "post",
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create",
      {
        shop_id: 78925,
        to_name: name,
        to_phone: phone,
        to_address: `${address.streetOrBuilding}, ${address.ward}, ${address.district}, ${address.city}`,
        to_ward_code: addressId.wardCode,
        to_district_id: addressId.to_district_id,
        cod_amount: price,
        weight: 100 * quantity,
        length: 20,
        width: 30,
        height: 5 * quantity,
        service_type_id: serviceTypeId,
        service_id: serviceId,
        payment_type_id: 2, //người mua trả tiền ship
        required_note: "CHOTHUHANG", //cho thử hàng trước khi nhận
        Items: [],
        name: "Thời trang",
        quantity: quantity,
      }
    );
    return {
      shipOrderId: response.data.data.order_code,
      shippingFee: response.data.data.total_fee,
      expectedReceiveDate: response.data.data.expected_delivery_time,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports.GHNshippingFee = async function GHNshippingFee(address) {
  const addressId = await GHNgetAddressCode(address);
  if (addressId.districtId && addressId.wardCode) {
    services = await GHNgetService(addressId);
    var result = [];
    if (services) {
      for (var i = services.length - 1; i > 0; i--) {
        const fee = await GHNgetShippingFee(addressId, services[i].serviceId);
        const date = await GHNgetReceiveDate(addressId, services[i].serviceId);
        if (fee !== null && date !== null)
          result.push({
            serviceId: services[i].serviceId,
            serviceTypeId: services[i].serviceTypeId,
            name:
              "Giao hàng nhanh" +
              (services[i].serviceTypeId === 1
                ? " - Hỏa tốc"
                : services[i].serviceTypeId === 2
                ? " - Giao nhanh"
                : ""),
            shippingFee: fee,
            date: date,
          });
      }
    }
    if (result.length > 0) return result;
  }
};

async function GHNgetShippingFee(addressId, serviceId) {
  try {
    const response = await apiCallerDelivery(
      "post",
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        shop_id: 78925,
        service_id: serviceId,
        from_district_id: Number(process.env.STORE_DISTRICT_ID),
        to_district_id: addressId.districtId,
        weight: 1000,
        length: 20,
        width: 30,
        height: 10,
      }
    );
    return response.data.data.total;
  } catch (error) {
    return null;
  }
}

async function GHNgetService(addressId) {
  const response = await apiCallerDelivery(
    "post",
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
    {
      shop_id: 78925,
      from_district: Number(process.env.STORE_DISTRICT_ID),
      to_district: addressId.districtId,
    }
  );
  const services = response.data.data.map((service) => {
    return {
      serviceId: service.service_id,
      serviceTypeId: service.service_type_id,
      name: service.short_name,
    };
  });
  return services;
}

async function GHNgetReceiveDate(addressId, serviceId) {
  const response = await apiCallerDelivery(
    "post",
    "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime",
    {
      shop_id: 78925,
      from_district_id: Number(process.env.STORE_DISTRICT_ID),
      to_district_id: addressId.districtId,
      to_ward_code: addressId.wardCode,
      service_id: serviceId,
    }
  );
  return response.data.data.leadtime;
}

async function GHNgetAddressCode(address) {
  const proResult = await apiCallerDelivery(
    "post",
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
    {}
  );
  const provinces = proResult.data.data;

  const provincesName = provinces.map((province) => {
    return province.ProvinceName;
  });
  const proBestMatchResult = stringSimilarity.findBestMatch(
    address.city,
    provincesName
  );
  const provinceId = provinces[proBestMatchResult.bestMatchIndex].ProvinceID;
  ////////////////////
  const disResult = await apiCallerDelivery(
    "post",
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
    {
      province_id: provinceId,
    }
  );
  const districts = disResult.data.data;
  const districtsName = districts.map((district) => {
    return district.DistrictName;
  });
  const disBestMatchResult = stringSimilarity.findBestMatch(
    address.district,
    districtsName
  );
  const districtId = districts[disBestMatchResult.bestMatchIndex].DistrictID;
  /////////////////////
  const wardResult = await apiCallerDelivery(
    "post",
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
    {
      district_id: districtId,
    }
  );
  const wards = wardResult.data.data;
  const wardsName = wards.map((ward) => {
    return ward.WardName;
  });
  const wardBestMatchResult = stringSimilarity.findBestMatch(
    address.ward,
    wardsName
  );
  const wardCode = wards[wardBestMatchResult.bestMatchIndex].WardCode;

  return { wardCode, districtId, provinceId };
}
