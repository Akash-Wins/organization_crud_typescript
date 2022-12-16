import MESSAGE from "../helpers/message_helper";
import Response  from "../helpers/response_helper";
import user from "../models/user";
import organization from "../models/organization";
import IOrgAdd from "../interfaces/Iaddorg"
import IOrgUpdate from "../interfaces/Iorgupdate";
import IResponse from "src/interfaces/Iresponse";
import IRequest from "src/interfaces/Irequest";

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
  }
  export default new orgServices();