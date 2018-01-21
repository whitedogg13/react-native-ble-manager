import React, {Component} from 'react'
import {
    View,
    Text,
    Platform,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from 'react-native'

const Theme = {
    color: '#4FC3F7',
    navbarHeight: Platform.OS === 'ios' ? 64 : 72,
    navbarPaddingTop: Platform.OS === 'ios' ? 20 : 0,
};

class NavBar extends Component {
    render() {
        return (
            <View style={{
                position: 'absolute', left: 0, top: 0, right: 0, height: Theme.navbarHeight, 
                paddingTop: Theme.navbarPaddingTop, paddingLeft: 8, paddingRight: 8,
                backgroundColor: Theme.color, flexDirection: 'row', alignItems: 'center'
            }}>
                { this.props.children }
            </View>
        )
    }
}

class Btn extends Component {
    render() {
        return (
            <TouchableOpacity 
                    style={{borderWidth: 1, borderRadius: 5, borderColor: Theme.color, padding: 10}}
                    onPress={this.props.onPress}>
                    <Text style={{color: Theme.color}}>{this.props.children}</Text>
            </TouchableOpacity>
        )
    }
}

class Peripheral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }
    render() {
        let {expanded} = this.state;
        let {data, onConnect} = this.props;
        return (
            <View style={{borderBottomColor: 'lightgrey', borderBottomWidth: 1, alignItems: 'stretch'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
                    <Text style={{flex: 1}}>This is a peripheral</Text>

                    <Btn onPress={() => this.setState({expanded: !expanded})}>
                        {`${expanded ? 'See Less' : 'See More'}`}
                    </Btn>
                </View>

                {
                    expanded && (
                        <View style={{padding: 20}}>
                            <View style={{height: 100}}>
                                
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Btn onPress={onConnect}>
                                    {`Connect`}
                                </Btn>
                            </View>
                        </View>
                    )
                }
            </View>
        )
    }
}

class ConnectionPanel extends Component {
    render() {
        let {onClose} = this.props;

        return (
            <View style={{ position: 'absolute', padding: 20, top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <View style={{flex: 1, alignSelf: 'stretch', backgroundColor: 'white', padding: 20}}>
                    <View style={{flex: 1}}></View>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Btn onPress={onClose}>
                            Close
                        </Btn>
                    </View>
                </View>
            </View>
        )
    }
}

const UiState = {
    idle: 0,
    scanning: 1
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connect: false,
            peripherals: {},
            uiState: UiState.idle,
        };
    }

    /*
    componentDidMount() {
        this._handleDiscovery = bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            peripheral => {
                let { peripherals } = this.state;
                this.setState({
                    peripherals: {
                        ...peripherals,
                        [peripheral.id]: peripheral
                    }
                })
            }
        );
    }

    componentWillUnmount() {
        this._handleDiscovery.remove();
    }
    */

    render() {
        let {connect} = this.state;

        return (
            <View style={{flex: 1, paddingTop: Theme.navbarHeight}}>
                <StatusBar barStyle="light-content"/>

                <NavBar>
                    <Text style={{color: 'white', fontSize: 20, width: 100, textAlign: 'left', flex: 1}}>ReactNative BLE Manager</Text>
                    { this._renderScanButton() }
                </NavBar>

                <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems: 'stretch'}}>
                    <Peripheral onConnect={() => this.setState({connect: !connect})}/>
                    <Peripheral />
                    <Peripheral />
                    <Peripheral />
                </ScrollView>

                {
                    connect && (
                        <ConnectionPanel onClose={() => this.setState({connect: false})}/>
                    )
                }
            </View>
        )
    }

    _renderScanButton = () => {
        let {uiState} = this.state;
        if (uiState === UiState.scanning) {
            return <ActivityIndicator color='white'/>
        }
        return (
            <TouchableOpacity onPress={this._doScan}>
                <Text style={{color: 'white', width: 100, textAlign: 'right'}}>Scan</Text>
            </TouchableOpacity>
        )
    }

    _doScan = () => {
        this.setState({
            peripherals: {},
            uiState: UiState.scanning
        });
        setTimeout(() => {
            this.setState({uiState: UiState.idle})
        }, 5000);
    }
}

export default App;