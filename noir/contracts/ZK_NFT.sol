pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./IVerifier.sol";

contract ZK_NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    ISudokuVerifier sv;
    // IWordleVerifier wv;
    ITriviaVerifier tv;

    enum Game {
        SUDOKU,
        WORDLE,
        TRIVIA
    }

    // instantiate attendee type for a tokenID. Used to set uri's.
    mapping(uint256 => Game) public tokenType;

    constructor(address _sv) ERC721("ZK_NFT", "ZK_NFT") {
        sv = ISudokuVerifier(_sv);
        // wv = IWordleVerifier(_wv);
        // tv = ITriviaVerifier(_tv);
    }

    function mintSudokuNFT(address recipient, string memory tokenURI, bytes calldata proof) public returns (uint256) {
        require(sv.verify(proof), "Invalid Proof!");
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenType[newItemId] = Game.SUDOKU;

        return newItemId;
    }

    // function mintWordleNFT(address recipient, string memory tokenURI, bytes calldata proof) public returns (uint256) {
    //     require(wv.verify(proof), "Invalid Proof!");
    //     _tokenIds.increment();

    //     uint256 newItemId = _tokenIds.current();
    //     _mint(recipient, newItemId);
    //     _setTokenURI(newItemId, tokenURI);
    //     tokenType[newItemId] = Game.WORDLE;

    //     return newItemId;
    // }

    // function mintTriviaNFT(address recipient, string memory tokenURI, bytes calldata proof) public returns (uint256) {
    //     require(tv.verify(proof), "Invalid Proof!");
    //     _tokenIds.increment();

    //     uint256 newItemId = _tokenIds.current();
    //     _mint(recipient, newItemId);
    //     _setTokenURI(newItemId, tokenURI);
    //     tokenType[newItemId] = Game.TRIVIA;

    //     return newItemId;
    // }
}
