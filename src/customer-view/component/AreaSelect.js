/**
 * AreaSelect
 * wangbo
 * 2019/10/11
 */
import React  from 'react';
import { Select, Input } from 'cloud-react';

class AreaSelect extends React.Component {
    constructor(props) {
        super(props);
        const { state, city, district, town, address } = this.props;

        this.state = {
            state,
            city,
            district,
            town,
            address
        };

        this.getAreasFromLocalStorage();
    }

    /**
     * 获取地址库
     * @returns {any}
     */
    getAreasFromLocalStorage = () => {
        this.areaList = JSON.parse(localStorage.getItem('UNIFIFCATION_AREA_SELECTOR_DATA'));
        this.cityList = [];
        this.districtList = [];
        this.townList = [];

        // 遍历省份获取市列表
        this.areaList.forEach((stateInfo, index) => {
            if (stateInfo.id === this.state.state) {
                this.cityList = this.areaList[index].children;
                this.loading = false;
            }
        });
        // 遍历市区获取县区列表
        this.cityList.forEach((cityInfo, index) => {
            if (cityInfo.id === this.state.city) {
                this.districtList = this.cityList[index].children;
                this.loading = false;
            }
        });
        // 遍历县区获取乡镇列表
        this.districtList.forEach((districtInfo, index) => {
            if (districtInfo.id === this.state.district) {
                this.townList = this.districtList[index].children;
                this.loading = false;
            }
        });
    };

    /**
     * 切换省份地址
     */
    handleChangeProvince = value => {
        this.setState({
            city: '',
            district: '',
            town: '',
            address: ''
        });
        this.areaList.forEach((stateInfo, index) => {
            if (stateInfo.id === value) {
                this.cityList = this.areaList[index].children;
                this.loading = false;
            }
        });
    };

    /**
     * 切换城市地址
     * @param value
     */
    handleChangeCity = value => {
        this.setState({
            district: '',
            town: '',
            address: ''
        });
        this.cityList.forEach((cityInfo, index) => {
            if (cityInfo.id === value) {
                this.districtList = this.cityList[index].children;
                this.loading = false;
            }
        });
    };

    /**
     * 切换县区地址
     * @param value
     */
    handleChangeDistrict = value => {
        this.setState({
            town: '',
            address: ''
        });
        this.districtList.forEach((districtInfo, index) => {
            if (districtInfo.id === value) {
                this.townList = this.districtList[index].children;
                this.loading = false;
            }
        });
    };

    /**
     * 切换乡镇
     */
    handleChangeTown = () => {
        this.setState({
            address: ''
        });
    };

    render() {
        const { Option } = Select;
        const style = {
            display: 'inline-block',
            background: 'white',
            verticalAlign: 'middle'
        };

        return (
            <div style={style}>
                <Select style={style} defaultValue={this.state.state} onChange={this.handleChangeProvince}>
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
                <Select style={style} defaultValue={this.state.city} onChange={this.handleChangeCity}>
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
                <Select style={style} defaultValue={this.state.district} onChange={this.handleChangeDistrict}>
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
                <Select style={style} defaultValue={this.state.town} onChange={this.handleChangeTown}>
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
                <Input value={this.state.address}/>
            </div>
        );
    }
}

export default AreaSelect;
