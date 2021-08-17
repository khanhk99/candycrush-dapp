// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _setOwner(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
   * @dev modifier to allow actions only when the contract IS paused
   */
  modifier whenNotPaused() {
    require(!paused);
    _;
  }

  /**
   * @dev modifier to allow actions only when the contract IS NOT paused
   */
  modifier whenPaused {
    require(paused);
    _;
  }

  /**
   * @dev called by the owner to pause, triggers stopped state
   */
  function pause() external onlyOwner whenNotPaused returns (bool) {
    paused = true;
    emit Pause();
    return true;
  }

  /**
   * @dev called by the owner to unpause, returns to normal state
   */
  function unpause() external onlyOwner whenPaused returns (bool) {
    paused = false;
    emit Unpause();
    return true;
  }
}

interface ITRC21 {
    function balanceOf(address who) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

contract Game is Ownable, Pausable{
    address public tokenTRC21;
    
    uint public deadline;
    uint public fee = 0;
    uint public gameId = 0;
    uint public amount = 0;
    
    struct UserPoint{
        uint gameId;
        uint point;
        address userAddress;
    }
    
    UserPoint[] public userPoints;
    
    event CreateNewGame(uint _gameId, uint _deadline, uint _fee);
    event SaveNewPoint(uint _point, address _user);
    event Reward(address _top1, address _top2, address _top3);
    
    function setTokenTRC21(address tokenAddress) public onlyOwner{
        tokenTRC21 = tokenAddress;
    }
   //set deadline for game
    function setDeadline(uint _timestamp) private {
        require(deadline < block.timestamp, "A game is running");
        deadline = _timestamp;
    }
    
    //set fee for game
    function setFee(uint _fee) private {
        require(_fee > 10**18, "Require fee greater than 1");
        fee = _fee;
    }
    
    function newGame(uint _timestamp, uint _fee) public onlyOwner {
        setDeadline(_timestamp);
        setFee(_fee);
        gameId += 1;
        emit CreateNewGame(gameId, _timestamp, _fee);
    }
    
    //User save point after play
    function savePoint(uint _point) external whenNotPaused{
        require(ITRC21(tokenTRC21).transferFrom(_msgSender(), address(this), fee));
        UserPoint memory userPoint = UserPoint(gameId, _point, _msgSender());
        userPoints.push(userPoint);
        amount += fee;
        emit SaveNewPoint(_point, _msgSender());
    }
    
    //reward to user
    function reward(address _top1, address _top2, address _top3) public onlyOwner{
        uint amountTop1 = amount * 60 / 100;
        uint amountTop2 = amount * 30 / 100;
        uint amountTop3 = amount * 10 / 100;
        ITRC21(tokenTRC21).transferFrom(address(this), _top1, amountTop1);
        amount -= amountTop1;
        ITRC21(tokenTRC21).transferFrom(address(this), _top2, amountTop2);
        amount -= amountTop2;
        ITRC21(tokenTRC21).transferFrom(address(this), _top3, amountTop3);
        amount -= amountTop3;
        emit Reward(_top1, _top2, _top3);
    }
}