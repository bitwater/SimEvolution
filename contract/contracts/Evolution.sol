// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./base64.sol";

// @author bitwater

// @notice This contract is heavily inspired by Dom Hofmann's Loot Project, zeth's Settlements with game design from Sid Meier's Civilization & Maxis Spore.

// An allocation of 200 Evolution Puzzles are reserved for owner

contract Evolution is ERC721, ERC721Enumerable, ReentrancyGuard, Ownable {

    constructor() ERC721("SimEvolution", "SE") {}

    struct Attributes {
        uint8 atom;
        uint8 molecular;
        uint8 cell;
        uint8 language;
        uint8 organism;
        uint8 civilization;
        uint8 science;
        uint8 industry;
        uint8 information;
        uint8 metaverse;
    }

    string[] private _atoms = ['O', 'C', 'H', 'N', 'Ca', 'Na', 'Si', 'Fe', 'Cu', 'Ag', 'Au'];
    string[] private _moleculars = ['O2', 'H2O', 'CO2', 'DNA', 'RNA', 'Protein', 'Carbohydrate', 'Glucose', 'Fat', 'Hormone'];
    string[] private _cells = ['Zygote', 'Blood', 'Bone', 'Muscle', 'Blood', 'Eye', 'Leg', 'Mouth', 'Nervous', 'Brain'];
    string[] private _organisms = ['Bacteria', 'Plant', 'Animal', 'Apple', 'Species', 'Community', 'Ecosystem', 'Ant', 'Homo sapiens'];
    string[] private _languages = ['Language', 'Writing', 'Calendar', 'Law', 'Philosophy', 'Paper', 'Religion'];
    string[] private _civilizations = ['Wheel', 'Agriculture', 'Sailing', 'Metal Casting', 'Mathematics', 'Currency', 'Art', 'Printing'];
    string[] private _sciences = ['Physics', 'Chemistry', 'Biology', 'Geography', 'Electricity', 'Economics', 'Engine', 'Medicine'];
    string[] private _industries = ['Steam Power', 'Railroad', 'Company', 'Finance', 'Flight', 'Rocket', 'Nuclear Fission', 'Aerospace'];
    string[] private _informations = ['Computer', 'Information Theory', 'Cryptography', 'Operating System', 'TCP/IP', 'Website', 'Search Engine', 'Social Network', 'Mobile Phone', 'GPU', 'Chip'];
    string[] private _metaverses = ['Blockchain', 'NFT', 'Crypto Currency', 'Bitcoin', 'Ethereum', 'Decentralized Finance', 'Internet of Things', 'Artificial Intelligence', 'Virtual Reality', '5G', 'Brain-computer Interface', 'Web3.0'];

    mapping(uint256 => Attributes) private attrIndex;

    function indexFor(string memory input, uint256 length) internal pure returns (uint256){
        return uint256(keccak256(abi.encodePacked(input))) % length;
    }

    function _getRandomSeed(uint256 tokenId, string memory seedFor) internal view returns (string memory) {
        return string(abi.encodePacked(seedFor, Strings.toString(tokenId), block.timestamp, block.difficulty));
    }

    function generateAttribute(string memory salt, string[] memory items) internal pure returns (uint8){
        return uint8(indexFor(string(salt), items.length));
    }

    function _makeParts(uint256 tokenId) internal view returns (string[21] memory){
        string[21] memory parts;
        parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.txt { fill: black; font-family: monospace; font-size: 12px;}</style><rect width="100%" height="100%" fill="white" /><text x="10" y="20" class="txt">';
        parts[1] = _atoms[attrIndex[tokenId].atom];
        parts[2] = '</text><text x="10" y="40" class="txt">';
        parts[3] = _moleculars[attrIndex[tokenId].molecular];
        parts[4] = '</text><text x="10" y="60" class="txt">';
        parts[5] = _cells[attrIndex[tokenId].cell];
        parts[6] = '</text><text x="10" y="80" class="txt">';
        parts[7] = _organisms[attrIndex[tokenId].organism];
        parts[8] = '</text><text x="10" y="100" class="txt">';
        parts[9] = _languages[attrIndex[tokenId].language];
        parts[10] = '</text><text x="10" y="120" class="txt">';
        parts[11] = _civilizations[attrIndex[tokenId].civilization];
        parts[12] = '</text><text x="10" y="140" class="txt">';
        parts[13] = _sciences[attrIndex[tokenId].science];
        parts[14] = '</text><text x="10" y="160" class="txt">';
        parts[15] = _industries[attrIndex[tokenId].industry];
        parts[16] = '</text><text x="10" y="180" class="txt">';
        parts[17] = _informations[attrIndex[tokenId].information];
        parts[18] = '</text><text x="10" y="200" class="txt">';
        parts[19] = _metaverses[attrIndex[tokenId].metaverse];
        parts[20] = '</text></svg>';
        // console.log(parts);
        return parts;
    }

    function _makeAttributeParts(string[21] memory parts) internal pure returns (string[21] memory){
        string[21] memory attrParts;
        attrParts[0] = '[{ "trait_type": "Atom", "value": "';
        attrParts[1] = parts[1];
        attrParts[2] = '" }, { "trait_type": "Molecular", "value": "';
        attrParts[3] = parts[3];
        attrParts[4] = '" }, { "trait_type": "Cell", "value": "';
        attrParts[5] = parts[5];
        attrParts[6] = '" }, { "trait_type": "Organism", "value": "';
        attrParts[7] = parts[7];
        attrParts[8] = '" }, { "trait_type": "Language", "value": "';
        attrParts[9] = parts[9];
        attrParts[10] = '" }, { "trait_type": "Civilization", "value": "';
        attrParts[11] = parts[11];
        attrParts[12] = '" }, { "trait_type": "Science", "value": "';
        attrParts[13] = parts[13];
        attrParts[14] = '" }, { "trait_type": "Industry", "value": "';
        attrParts[15] = parts[15];
        attrParts[16] = '" }, { "trait_type": "Information", "value": "';
        attrParts[17] = parts[17];
        attrParts[18] = '" }, { "trait_type": "Metaverse", "value": "';
        attrParts[19] = parts[19];
        attrParts[20] = '" }]';
        // console.log(attrParts);
        return attrParts;
    }

    function tokenURI(uint256 tokenId) virtual override public view returns (string memory) {
        require(_exists(tokenId), "Evolution Puzzles does not exist");

        string[21] memory parts = _makeParts(tokenId);
        string[21] memory attributesParts = _makeAttributeParts(parts);
        
        string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8]));
        output = string(abi.encodePacked(output, parts[9], parts[10], parts[11], parts[12], parts[13], parts[14], parts[15]));
        output = string(abi.encodePacked(output, parts[16], parts[17], parts[18], parts[19], parts[20]));

        string memory atrrOutput = string(abi.encodePacked(attributesParts[0], attributesParts[1], attributesParts[2], attributesParts[3], attributesParts[4], attributesParts[5], attributesParts[6], attributesParts[7], attributesParts[8]));
        atrrOutput = string(abi.encodePacked(atrrOutput, attributesParts[9], attributesParts[10], attributesParts[11], attributesParts[12], attributesParts[13], attributesParts[14], attributesParts[15]));
        atrrOutput = string(abi.encodePacked(atrrOutput, attributesParts[16], attributesParts[17], attributesParts[18], attributesParts[19], attributesParts[20]));

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "Evolution Puzzle #', Strings.toString(tokenId), '", "description": "Evolution Puzzles", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"', ',"attributes":', atrrOutput, '}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));

        return output;
    }

    function randomiseAttributes(uint256 tokenId) internal {
        attrIndex[tokenId].atom = generateAttribute(_getRandomSeed(tokenId, 'atom'), _atoms);
        attrIndex[tokenId].molecular = generateAttribute(_getRandomSeed(tokenId, 'molecular'), _moleculars);
        attrIndex[tokenId].cell = generateAttribute(_getRandomSeed(tokenId, 'cell'), _cells);
        attrIndex[tokenId].organism = generateAttribute(_getRandomSeed(tokenId, 'organism'), _organisms);
        attrIndex[tokenId].language = generateAttribute(_getRandomSeed(tokenId, 'language'), _languages);
        attrIndex[tokenId].civilization = generateAttribute(_getRandomSeed(tokenId, 'civilization'), _civilizations);
        attrIndex[tokenId].science = generateAttribute(_getRandomSeed(tokenId, 'science'), _sciences);
        attrIndex[tokenId].industry = generateAttribute(_getRandomSeed(tokenId, 'industry'), _industries);
        attrIndex[tokenId].information = generateAttribute(_getRandomSeed(tokenId, 'information'), _informations);
        attrIndex[tokenId].metaverse = generateAttribute(_getRandomSeed(tokenId, 'metaverse'), _metaverses);
    }

    function mint(uint256 tokenId) public nonReentrant {
        require(!_exists(tokenId) && tokenId > 0 && tokenId < 9801, "Evolution Puzzles id is invalid");
        randomiseAttributes(tokenId);
        _safeMint(msg.sender, tokenId);
    }

    function mintForOwner(uint256 tokenId) public nonReentrant onlyOwner {
        require(!_exists(tokenId) && tokenId > 9800 && tokenId < 10001, "Evolution Puzzles id is invalid");
        randomiseAttributes(tokenId);
        _safeMint(msg.sender, tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
    internal
    override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}