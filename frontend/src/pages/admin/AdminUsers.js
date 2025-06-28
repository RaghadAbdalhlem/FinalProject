/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Col,
  Row,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Archive, ChevronDown, MoreVertical, Trash2, UserX, UserCheck } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDeleteUserMutation, useGetUsersQuery, useBlockUserMutation, useUnblockUserMutation } from "../../redux/api/userAPI";
import { useEffect, useState } from "react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [deleteUser] = useDeleteUserMutation();
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const { data: users, refetch, isLoading } = useGetUsersQuery();
  const [selectedId, setSelectedId] = useState(null);
  const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleDeleteModal = (id) => {
    setSelectedId(id);
    setModalDeleteVisibility(!modalDeleteVisibility);
  };

  const handleDeleteUser = async () => {
    try {
      if (selectedId) {
        await deleteUser(selectedId).unwrap();
        toast.success("User deleted successfully");
        refetch();
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setModalDeleteVisibility(false);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      await blockUser(id).unwrap();
      toast.success("User blocked successfully");
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      await unblockUser(id).unwrap();
      toast.success("User unblocked successfully");
      refetch();
    } catch (error) {
      const errorMessage =
        error?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const roleColors = {
    admin: "primary",
    "content-manager": "warning",
    user: "secondary",
  };
  
  const statusColors = {
    active: "success",
    blocked: "danger",
  };

  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => (
        <Badge color={roleColors[row.role] || "dark"} className="p-2">
          {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
        </Badge>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge color={statusColors[row.status] || "secondary"} className="p-2">
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      width: "150px",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer action-btn" />
          </DropdownToggle>
          <DropdownMenu end container="body">
            <DropdownItem
              className="w-100"
              onClick={() => navigate(`/admin/users/update/${row._id}`)}
            >
              <Archive size={14} className="mx-1" />
              <span className="align-middle mx-2">Update</span>
            </DropdownItem>

            {row.role !== "admin" && (
              <DropdownItem onClick={() => toggleDeleteModal(row._id)}>
                <Trash2 size={14} className="mx-1" />
                <span className="align-middle mx-2">Delete</span>
              </DropdownItem>
            )}

            {
              row.status === "active" && row.role !== "admin" ? (
                <DropdownItem onClick={() => handleBlockUser(row._id)}>
                  <UserX size={14} className="mx-1" />
                  <span className="align-middle mx-2">Block</span>
                </DropdownItem>
              ) : row.role !== "admin" && (
                <DropdownItem onClick={() => handleUnblockUser(row._id)}>
                  <UserCheck size={14} className="mx-1" />
                  <span className="align-middle mx-2">Unblock</span>
                </DropdownItem>
              )
            }

          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    }

  ];

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">User Management</h3>
          <a href="/admin/users/create" className="btn btn-primary btn-sm">
            Create User
          </a>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <DataTable
              title="Users"
              data={users || []}
              responsive
              className="react-dataTable"
              noHeader
              pagination
              paginationRowsPerPageOptions={[10, 25, 50]}
              columns={columns}
              sortIcon={<ChevronDown />}
              highlightOnHover
              progressPending={isLoading}
            />
          </Card>
        </Col>
      </Row>
      <Modal isOpen={modalDeleteVisibility} toggle={() => toggleDeleteModal()}>
        <ModalHeader toggle={() => toggleDeleteModal()}>Delete Confirmation</ModalHeader>
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
          <Button color="secondary" onClick={() => toggleDeleteModal()} outline>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminUsers;
