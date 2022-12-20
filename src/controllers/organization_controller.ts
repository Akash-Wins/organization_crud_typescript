import MESSAGE from "../helpers/message_helper";
import Response  from "../helpers/response_helper";
import user from "../models/user";
import organization from "../models/organization";
import IOrgAdd from "../interfaces/Iaddorg"
import IOrgUpdate from "../interfaces/Iorgupdate";
import IResponse from "src/interfaces/Iresponse";
import IRequest from "src/interfaces/Irequest";
import IAddUser from "src/interfaces/Iadduser";
import {Parser} from "json2csv"
import PDFDocument from "pdfkit";
import fs from "fs";
class orgServices {
    async addOrganization(req:IOrgAdd, res:IResponse) {
      try {
        const idUser = req.userToken._id;
        const user_id = await user.findOne({ _id: req.userToken._id });
        if (user_id.isDeleted == true) {
          let resPayload = {
            message: MESSAGE.USER_NOT_FOUND,
          };
          return Response.error(res, resPayload);
        }
        const attribute = {
          orgName: req.body.orgName,
          userId: idUser,
          address: req.body.address,
        };
        const orgs = await new organization(attribute);
        orgs
          .save()
          .then(async (value) => {
            const activeStatusUpdate = await organization.updateMany(
              { userId: req.userToken._id, _id: { $ne: value._id } },
              { isActive: false }
            );
            let resPayload = {
              message: MESSAGE.ORG_ADD_SUCCESSFULLY,
              payload: value,
            };
            return Response.success(res, resPayload);
          })
          .catch((err) => {
            let resPayload = {
              message: MESSAGE.ORG_NOT_ADD,
            };
            return Response.error(res, resPayload);
          });
      } catch (err) {
        let resPayload = {
          message: MESSAGE.SERVER_ERROR,
        };
        return Response.error(res, resPayload);
      }
    }
    async organizationAllData(req:IRequest, res:IResponse) {
      try {
        const orgResult = await user.aggregate([
          {
            $lookup: {
              from: "organizations",
              localField: "_id",
              foreignField: "userId",
              as: "organization",
            },
          },
          {
            $project: {
              userName: 1,
              organization: {
                orgName: 1,
                address: {
                  organization: 1,
                  address1: 1,
                  address2: 1,
                  city: 1,
                  state: 1,
                  country: 1,
                  zipCode: 1,
                },
              },
            },
          },
        ]);
        let resPayload = {
          message: MESSAGE.ORGANIZATION_LIST,
          payload: orgResult,
        };
        return Response.success(res, resPayload);
      } catch (err) {
        let resPayload = {
          message: MESSAGE.SERVER_ERROR,
        };
        return Response.error(res, resPayload);
      }
    }
    async organizationUpdate(req:IOrgUpdate, res:IResponse) {
      try {
        const idUser = req.userToken._id;
        const orgId = await organization.findById({ _id: req.params.id });

        if (orgId.userId!= idUser) {
          let resPayload = {
            message: MESSAGE.NOT_ALLOWED,
          };
          return Response.error(res, resPayload);
        }
        const updateOrg = await organization
          .findByIdAndUpdate(
            req.params.id,
            { ...req.body, isActive: true },
            { new: true }
          )
          .then(async (value) => {
            const activeStatusUpdate = await organization.updateMany(
              { _id: req.userToken._id, userId: { $ne: value._id } },
              { isActive: false }
            );
            let resPayload = {
              message: MESSAGE.ORGANIZATION_UPDATED,
              payload: value,
            };
            return Response.success(res, resPayload);
          })
          .catch((err) => {
            let resPayload = {
              message: MESSAGE.ORGANIZATION_NOT_UPDATED,
            };
            return Response.error(res, resPayload);
          });
      } catch (err) {
        let resPayload = {
          message: MESSAGE.SERVER_ERROR,
        };
        return Response.error(res, resPayload);
      }
    }
    async userOrganization(req:IOrgAdd,res:IResponse){
      try{
        const idUser = req.userToken._id
        const singleUser = await user.aggregate([
          {
            '$lookup': {
              'from': 'organizations', 
              'localField': '_id', 
              'foreignField': 'userId', 
              'as': 'org'
            }
          }, {
            '$match': {
              '_id': idUser
            }
          }, {
            '$project': {
              '_id': 1, 
              'firstName': 1, 
              'lastName': 1, 
              'email': 1, 
              'userName': 1, 
              'org': {
                '_id': 1, 
                'orgName': 1, 
                'isActive': 1, 
                'address': {
                  'address1': 1, 
                  'address2': 1, 
                  'city': 1, 
                  'state': 1, 
                  'country': 1
                }
              }
            }
          }
        ])
        let resPayload = {
          message: MESSAGE.ORGANIZATION_LIST,
          payload: singleUser
        };
        return Response.success(res, resPayload);
      } catch (err) {
        let resPayload = {
          message: MESSAGE.SERVER_ERROR,
        };
        return Response.error(res, resPayload);
      }
    }
     //Show all user data using csv
    async csv(req: IAddUser, res: IResponse) {
      try {
        const orgResult = await user.aggregate([
          {
            $lookup: {
              from: "organizations",
              localField: "_id",
              foreignField: "userId",
              as: "organization",
            },
          },
          {
            $project: {
              _id:1,
              userName:1,
              firstName:1,
              lastName:1,
              emai:1

              
            },
          },
        ]);
        //let allUserQrg = [{name:"akash"}]
        const json2pdfParser = new Parser();
        const csv = json2pdfParser.parse(orgResult);
        fs.writeFile("userdata.csv", csv, function (err) {
          if (err) {
            throw err;
          }
          console.log("file saved");
        });
        let resPayload = {
          message: "csv Done",
        };
        return Response.success(res, resPayload);
      } catch (err) {
        let resPayload = {
          message: MESSAGE.SERVER_ERROR,
          payload: {},
        };
        return Response.error(res, resPayload, 500);
      }
    }
    //Show all user data using pdf
    async pdf(req: IRequest, res: IResponse) {
      let allUserQrg = await user
        .aggregate([
          {
            $lookup: {
              from: "organizations",
              localField: "_id",
              foreignField: "userId",
              as: "organization",
            },
          },
          {
            $project: {
              _id:1,
              userName:1,
              firstName:1,
              lastName:1,
              emai:1

              
            },
          },
        ])
        .exec();
        
      const doc = new PDFDocument();

      doc
        .fontSize(15)
        .fillColor("blue")
        .fontSize(25)
        .text(JSON.stringify(allUserQrg, null, 2), 100, 100);
      doc.pipe(fs.createWriteStream("example.pdf"));
      
      doc.pipe(res);
      doc.end();
      
      
    }
  }
  export default new orgServices();