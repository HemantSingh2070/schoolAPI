const {addSchool,listNearestSchool} = require('../Services/school')

const handleAddSchool = async(req,res)=>{
    const {name,address,latitude,longitude} = req.body;
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ message:"Invalid name: Name must be a non-empty string."})
    }
    if (typeof address !== 'string' || address.trim() === '') {
        return res.status(400).json({ message:"Invalid address: Address must be a non-empty string."})
    }
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).json({ message:"Invalid latitude: Latitude must be a number between -90 and 90."})
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).json({ message:"Invalid longitude: Longitude must be a number between -180 and  180."})
    }
    const result = await addSchool(name,address,latitude,longitude);
    if (result) {
        return res.status(201).json({ message: `School added with id : ${result}`})
    }
    else {
        return res.status(500).json({ message: `Failed to add school.${result}`})
    }
}

const handleNearSchoolList = async(req,res) =>{
    const {latitude,longitude} = req.body;
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).json({ message:"Invalid latitude: Must be a number between -90 and 90."})
    }
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).json({message:"Invalid longitude: Must be a number between -180 and 180."})    
    }
    const result = await listNearestSchool(latitude,longitude);
    if (result) {
        return res.status(201).json({ schools:result})
    }
    else {
        return res.status(500).json({ message: `Failed to add school.${result}`})
    }
}

module.exports = {handleAddSchool,handleNearSchoolList};