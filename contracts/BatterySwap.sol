pragma solidity >=0.4.22 <0.6.0;

contract BatterySwap
{
	struct Battery
    {
        uint id;
        uint capacity;
        uint year;
        uint maxCycles;
        uint cycles;
        uint soc;
        uint soh;
        uint price;
        uint rate;
        address owner;
		uint swapID;
    }
    struct EVOwner
    {
        string name;
        string addres;
        address account;
		uint idx;//id of battery owned by ev owner
        uint bal;
		bool bat;
		uint reqStatus; //1 for requested,4 for not req, 2 for ACCEPTED, 3 for REJECTED
        bool exist;
        uint256 balance;
        address csowner;
    }
    struct CSOwner
    {
        string name;
        string addres;
        address account;
		uint[] idx; //array of batteries owned by the station
		uint[] ids; //array of pending requests
        uint[] uncharged;//array of uncharged batteries
        uint r;//number of uncharged batteries
        uint i; //number of batteries owned
		uint j; //number of pending requests
        bool exist;
    }
    bool public adminDone=false;
    address public admin;
    uint stationCount=0;
    mapping(address=>EVOwner) public EV;
    mapping(address=>CSOwner) public CS; 
    mapping(uint=>Battery) public battery;
	mapping(uint=>address) public station;
	function batExists(address x) public view returns (bool)
    {
        return EV[x].bat;
    }
    function userExists(address x) public view returns (bool)
    {
        return EV[x].exist;
    }
    function CSExists(address x) public view returns (bool)
    {
        return CS[x].exist;
    }
    //register EV Owner
    function makeadmin(string memory nname,string memory aaddress) public returns (bool)
    {
        if(userExists(msg.sender))return false;
        admin=msg.sender;
        EV[admin]=EVOwner({
            name: nname,
            addres: aaddress,
            account: admin,
			idx:0,
            bal:0,
			bat:false,
			reqStatus:4,
            exist: true,
            balance:0,
            csowner: msg.sender
        });
        return true;
    }
    //register company owner
    function makeCS(string memory nname,string memory aaddress) public returns (bool)
    {
        //if(CSExists(msg.sender))return false;
        admin=msg.sender;
        adminDone=true;
        CS[admin]=CSOwner({
            name: nname,
            addres: aaddress,
            account: admin,
			idx:new uint[](100),
			ids:new uint[](100),
            uncharged:new uint[](100),
            r:0,
            i:0,
			j:0,
            exist: true
        });
		station[stationCount]=admin;
		stationCount++;
        return true;
    }
    //register a battery
    function registerBattery(uint idd,uint yyear,uint ccap) public returns (bool)
    {
        admin=msg.sender;
		if(admin==EV[admin].account)
		{
			EV[admin].bat=true;
			EV[admin].idx=idd;
		}
		else if(admin==CS[admin].account)
		{
			uint k=CS[admin].i;
			CS[admin].idx[k]=idd;
			CS[admin].i++;
		}
        battery[idd]=Battery({
            id:idd,
            capacity:ccap,
            year:yyear,
            maxCycles:540,
            cycles:0,
            soc:100,
            soh:100,
            price:0,
            rate:0,
            owner:admin,
			swapID:0
        });
        return true;
    }
    //charge a battery
    function chargeBattery(uint idd,uint csoc,uint cr,address add) public returns (bool)
    {
        if(battery[idd].cycles>=battery[idd].maxCycles || battery[idd].owner!=add)
        {
            battery[idd].soh=0;
            return false;
        }
        battery[idd].soc=100;
        battery[idd].rate=cr;
        battery[idd].cycles++;
        uint k=battery[idd].cycles;
        if(k<300)
        {
            battery[idd].soh=(1000-battery[idd].cycles)/10;
        }
        else if(k>=300 && k<420)
        {
            battery[idd].soh=(720-k)/6;
        }
        else if(k>=420 && k<540)
        {
            battery[idd].soh=(1020-k)/12;
        }
        return true;
    }
    //discharge a battery
    function dischargeBattery(uint idd,address add) public returns (bool)
    {
        if(battery[idd].cycles>=battery[idd].maxCycles || battery[idd].id!=EV[add].idx || battery[idd].owner!=add)
        return false;
        battery[idd].soc=0;
        return true;
    }
    //delete a battery
    function deleteBattery(uint idd,address add) public returns (bool)
    {
        admin=msg.sender;
        if(battery[idd].id!=idd || battery[idd].owner!=add)
		return false;
		delete battery[idd];
		if(admin==EV[admin].account)
		{
			EV[admin].bat=false;
			EV[admin].idx=0;
		}
        return true;
    }
	//returns array of station addresses
	function statList() public returns (address [] memory temp)
	{
		address[] memory tempAd;
		temp=new address[](stationCount);
		for(uint i=0;i<stationCount;i++)
		{
			temp[i]=station[i];
		}
		return temp;
	}
	//returns station stationCount
	function statCount() public returns (uint)
	{
        return stationCount;
	}
	//sends swapping request
	function sendRequest(address s) public returns (bool)
	{
		admin=msg.sender;
		uint y=CS[s].j;   //number of pending requests
		CS[s].ids[y]=EV[admin].idx;
		CS[s].j++;
		EV[admin].reqStatus=1;
		return true;
	}
	//returns requested status(returns -1 for NOTREQUESTED,1 for REQUESTED,2 for ACCEPTED,3 for REJECTED)
	function sendStatus(address s) public returns (uint)
	{
		return EV[s].reqStatus;
	}
    //returns array of battery ids owned
    function batList(address s) public returns (uint [] memory temp)
	{
        uint[] memory tempAd;
        uint k=CS[s].i;
		temp=new uint[](k);
		for(uint i=0;i<k;i++)
		{
			temp[i]=CS[s].idx[i];
		}
		return temp;
	}
    //returns number of batteries owned
    function batCount(address s) public returns (uint)
    {
        return CS[s].i;
    }
    function reqList(address s) public returns (uint [] memory temp)
	{
        //address s=msg.sender;
        uint k=CS[s].j;
		temp=new uint[](k);
		for(uint i=0;i<k;i++)
		{
			temp[i]=CS[s].ids[i];
		}
		return temp;
	}
    function reqCount(address s) public returns (uint){
        return CS[s].j;
    }
    function swapBat(uint stat,uint veh) public returns (bool){
        address statad=battery[stat].owner;
        address vehad=battery[veh].owner;
        battery[stat].owner=vehad;
        battery[stat].swapID=veh;
        battery[veh].owner=statad;
        battery[veh].swapID=stat;
        EV[vehad].reqStatus=2;
        EV[vehad].idx=stat;
        EV[vehad].balance=500+20*(battery[stat].soh-battery[veh].soh);
        battery[veh].price=500+20*(battery[stat].soh-battery[veh].soh);
        EV[vehad].csowner=statad;
        return true;
    }
    function reject(uint id1) public returns (bool){
        address adx=battery[id1].owner;
        EV[adx].reqStatus=3;
        return true;
    }
    function changeStatus() public returns (bool){
        address evowner=msg.sender;
        EV[msg.sender].reqStatus=4;
        return true;
    }
    function swapping() public returns (bool)
    {
        address stat=msg.sender;
        uint a=CS[stat].i;
        uint b=CS[stat].j;//number of pending requests
        uint[] memory avail;
        uint[] memory pend;
        uint[] memory disc;
        avail=new uint[](a);
        pend=new uint[](b);
        disc=new uint[](a);
        uint p=0;//number of batteries available for swapping
        uint q=0;//number of batteries which are not available for swapping
        for(uint i=0;i<a;i++){
            if(battery[CS[stat].idx[i]].soc!=0 && battery[CS[stat].idx[i]].soh>=40){
                avail[p]=CS[stat].idx[i];
                p++;
            }
            else{
                disc[q]=CS[stat].idx[i];
                q++;
            }
        }
        for(uint i=0;i<b;i++){
            pend[i]=CS[stat].ids[i];
        }
        uint i;uint j;uint key;uint cur_id;
        //sorting avail array
        for(i=1;i<p;i++){
            j=i-1;
            cur_id=avail[i];
            key=battery[avail[i]].soh;
            while(j>=0 && battery[avail[j]].soh<key){
                avail[j+1]=avail[j];
                j=j-1;
            }
            avail[j+1]=cur_id;
        }
        //sorting pend array
        for(i=1;i<b;i++){
            j=i-1;
            cur_id=pend[i];
            key=battery[pend[i]].soh;
            while(j>=0 && battery[pend[j]].soh<key){
                pend[j+1]=pend[j];
                j=j-1;
            }
            pend[j+1]=cur_id;
        }
        i=0;
        j=0;
        while(i<p && j<b){
            uint psoh;uint asoh;
            psoh=battery[pend[j]].soh;
            asoh=battery[avail[i]].soh;
            if(psoh>=80){
                if(asoh>=79){
                    //swap
                    swapBat(avail[i],pend[j]);
                    uint x=avail[i];
                    avail[i]=pend[j];
                    pend[j]=x;
                    i++;
                    j++;
                    continue;
                }
                else{
                    //rejected
                    reject(pend[j]);
                    j++;
                    continue;
                }
            }
            else if(psoh>=60){
                if(asoh>=80){
                    i++;
                    continue;
                }
                else if(asoh>=59){
                    //swap
                    swapBat(avail[i],pend[j]);
                    uint x=avail[i];
                    avail[i]=pend[j];
                    pend[j]=x;
                    i++;
                    j++;
                    continue;
                }
                else{
                    //rejected
                    reject(pend[j]);
                    j++;
                    continue;
                }
            }
            else if(psoh>=40){
                if(asoh>=60){
                    i++;
                    continue;
                }
                else if(asoh>=40){
                    //swap
                    swapBat(avail[i],pend[j]);
                    uint x=avail[i];
                    avail[i]=pend[j];
                    pend[j]=x;
                    j++;
                    i++;
                    continue;
                }
                else{
                    //rejected
                    reject(pend[j]);
                    j++;
                }
            }
            else{
                //rejected
                reject(pend[j]);
                j++;
            }
        }
        while(j<b){
            reject(pend[j]);
            j++;
        }
        for(i=0;i<p;i++){
            CS[stat].idx[i]=avail[i];
        }
        for(i=p;i<a;i++){
            CS[stat].idx[i]=disc[i-p];
        }
        CS[stat].j=0;
        return true;
    }
}