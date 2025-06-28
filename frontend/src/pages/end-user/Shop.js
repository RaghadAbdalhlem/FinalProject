/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Col, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { ChevronDown, Eye, MoreVertical, Search } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from "../../redux/api/productAPI";
import { useEffect, useState } from "react";

const Shop = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');

  const queryParams = {
    searchQuery,
    category,
  };

  const { data: products, refetch, isLoading } = useGetProductsQuery(queryParams);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') setCategory(value);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const renderMedia = (media) => {
    if (!media) return null;

    const isVideo = /\.(mp4|webm|ogg)$/i.test(media);

    return isVideo ? (
      <video
        src={media}
        className="img-fluid"
        style={{ maxWidth: "50px", maxHeight: "50px" }}
        controls
      />
    ) : (
      <img
        src={media}
        alt="Product"
        className="img-fluid"
        style={{ maxWidth: "50px", maxHeight: "50px" }}
      />
    );
  };

  const columns = [
    {
      name: "Image",
      width: "100px",
      cell: (row) => renderMedia(row.image),
    },
    {
      name: "Product Title",
      width: "150px",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Category",
      width: "120px",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Price",
      width: "100px",
      selector: (row) => row.price,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) =>
        row.description.length > 30
          ? `${row.description.substring(0, 30)}...`
          : row.description,
      sortable: true,
      grow: 2,
    },
    {
      name: "Usage Instructions",
      selector: (row) =>
        row.usageInstructions.length > 30
          ? `${row.usageInstructions.substring(0, 30)}...`
          : row.usageInstructions,
      sortable: true,
      grow: 2,
    },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer action-btn" />
          </DropdownToggle>
          <DropdownMenu end container="body">
            <DropdownItem
              className="w-100"
              onClick={() => navigate(`/user/shop/view/${row._id}`)}
            >
              <Eye size={14} className="mx-1" />
              <span className="align-middle mx-2">View</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  return (
    <div className="container main-view">
      <Row className="my-3">
        <Col>
          <h3 className="mb-3">Shop</h3>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={3}>
          <Label for="search" className="font-weight-bold">Search</Label>
          <div className="search-bar">
            <Search className="search-icon" />
            <Input
              type="text"
              id="search"
              placeholder="Search by recipe name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </Col>
        <Col md={3}>
          <Label for="category" className="font-weight-bold">Category</Label>
          <Input
            type="select"
            id="category"
            name="category"
            value={category}
            onChange={handleFilterChange}
          >
            <option value="">Select Category</option>
            <option value="vitamins">Vitamins</option>
            <option value="proteins">Proteins</option>
            <option value="supplements">Supplements</option>
            <option value="herbs">Herbs</option>
            <option value="minerals">Minerals</option>
            <option value="other">Other</option>
          </Input>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <DataTable
              title="Products"
              data={products || []}
              responsive
              className="react-dataTable"
              noHeader
              pagination
              paginationRowsPerPageOptions={[10, 25, 50]}
              columns={columns}
              sortIcon={<ChevronDown />}
              highlightOnHover
              progressPending={isLoading} // Show loader while fetching
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Shop;
