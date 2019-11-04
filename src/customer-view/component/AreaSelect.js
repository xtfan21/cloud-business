/**
 * AreaSelect
 * wangbo
 * 2019/10/11
 */
import React  from 'react';
import { Select, Input } from 'cloud-react';
import './areaStyle.less';

class AreaSelect extends React.Component {
    constructor(props) {
        super(props);
        const addressValue = this.props.addressValue.split(',');
        const addressName= this.props.addressName.split(',');
        this.state = {
            province: addressValue[0] || '',
            provinceName: addressName[0] || '',
            city: addressValue[1] || '',
            cityName: addressName[1] || '',
            district: addressValue[2] || '',
            districtName: addressName[2] || '',
            town: addressValue[3] || '',
            townName: addressName[3] || '',
            address: addressValue[4] || ''
        };

        this.getAreasFromLocalStorage(addressValue[0], addressValue[1], addressValue[2]);
    }

    /**
     * 获取地址库
     * @returns {any}
     */
    getAreasFromLocalStorage = (province, city, district) => {
        this.areaList = JSON.parse(localStorage.getItem('UNIFIFCATION_AREA_SELECTOR_DATA'));
        this.cityList = [];
        this.districtList = [];
        this.townList = [];

        // 遍历省份获取市列表
        this.areaList.forEach((stateInfo, index) => {
            if (stateInfo.id === province) {
                this.cityList = this.areaList[index].children;
            }
        });
        // 遍历市区获取县区列表
        this.cityList.forEach((cityInfo, index) => {
            if (cityInfo.id === city) {
                this.districtList = this.cityList[index].children;
            }
        });
        // 遍历县区获取乡镇列表
        this.districtList.forEach((districtInfo, index) => {
            if (districtInfo.id === district) {
                this.townList = this.districtList[index].children;
            }
        });
    };

    /**
     * 切换省份地址
     */
    handleChangeProvince = item => {
        this.areaList.forEach((stateInfo, index) => {
            if (stateInfo.id === item.value) {
                this.cityList = this.areaList[index].children || [];
                this.districtList = [];
                this.townList = [];
                this.setState({
                    province: item.value,
                    provinceName: item.label,
                    city: '',
                    cityName: '',
                    district: '',
                    districtName: '',
                    town: '',
                    townName: '',
                    address: ''
                }, () => {
                    this.selectedAllArea(item.label, item.value, this.state.cityName, this.state.city, this.state.districtName, this.state.district, this.state.townName, this.state.town, this.state.address);
                });
            }
        });
    };

    /**
     * 切换城市地址
     * @param item
     */
    handleChangeCity = item => {
        this.cityList.forEach((cityInfo, index) => {
            if (cityInfo.id === item.value) {
                this.districtList = this.cityList[index].children || [];
                this.townList = [];
                this.setState({
                    city: item.value,
                    cityName: item.label,
                    district: '',
                    districtName: '',
                    town: '',
                    townName: '',
                    address: ''
                }, () => {
                    this.selectedAllArea(this.state.provinceName, this.state.province, item.label, item.value, this.state.districtName, this.state.district, this.state.townName, this.state.town, this.state.address);
                });
            }
        });
    };

    /**
     * 切换县区地址
     * @param item
     */
    handleChangeDistrict = item => {
        this.districtList.forEach((districtInfo, index) => {
            if (districtInfo.id === item.value) {
                this.townList = this.districtList[index].children || [];
                this.setState({
                    district: item.value,
                    districtName: item.label,
                    town: '',
                    townName: '',
                    address: ''
                }, () => {
                    this.selectedAllArea(this.state.provinceName, this.state.province, this.state.cityName, this.state.city, item.label, item.value, this.state.townName, this.state.town, this.state.address);
                });
            }
        });
    };

    /**
     * 切换乡镇
     */
    handleChangeTown = item => {
        this.setState({
            town: item.value,
            townName: item.label,
            address: ''
        }, () => {
            this.selectedAllArea(this.state.provinceName, this.state.province, this.state.cityName, this.state.city, this.state.districtName, this.state.district, item.label, item.value, this.state.address);
        });
    };

    /**
     * 输入详细地址
     * @returns {*}
     */
    handleInput = e => {
        this.setState({
            address: e.target.value
        });
        this.selectedAllArea(this.state.provinceName, this.state.province, this.state.cityName, this.state.city, this.state.districtName, this.state.district, this.state.townName, this.state.town, e.target.value);
    };

    /**
     * 选中地址
     * @param provinceName
     * @param province
     * @param cityName
     * @param city
     * @param districtName
     * @param district
     * @param townName
     * @param town
     * @param address
     */
    selectedAllArea = (provinceName, province, cityName, city, districtName, district, townName, town, address) => {
        this.props.selectdArea(provinceName, province, cityName, city, districtName, district, townName, town, address);
    };

    render() {
        const { Option } = Select;

        return (
            <div className="area-style">
                <Select value={this.state.province} labelInValue onChange={this.handleChangeProvince}>
                    {
                        this.areaList.map(stateItem => {
                            return(
                                <Option value={stateItem.id} key={stateItem.id} >
                                    {stateItem.name}
                                </Option>
                            );
                        })
                    }
                </Select>
                <Select value={this.state.city} labelInValue disabled={!this.cityList.length} onChange={this.handleChangeCity}>
                    {
                        this.cityList.map(cityItem => {
                            return(
                                <Option value={cityItem.id} key={cityItem.id}>
                                    {cityItem.name}
                                </Option>
                            );
                        })
                    }
                </Select>
                <Select value={this.state.district} labelInValue disabled={!this.districtList.length} onChange={this.handleChangeDistrict}>
                    {
                        this.districtList.map(districtItem => {
                            return(
                                <Option value={districtItem.id} key={districtItem.id}>
                                    {districtItem.name}
                                </Option>
                            );
                        })
                    }
                </Select>
                <Select value={this.state.town} labelInValue disabled={!this.townList.length} onChange={this.handleChangeTown}>
                    {
                        this.townList.map(townItem => {
                            return(
                                <Option value={townItem.id} key={townItem.id}>
                                    {townItem.name}
                                </Option>
                            );
                        })
                    }
                </Select>
                <Input value={this.state.address} onChange={this.handleInput}/>
            </div>
        );
    }
}

export default AreaSelect;
