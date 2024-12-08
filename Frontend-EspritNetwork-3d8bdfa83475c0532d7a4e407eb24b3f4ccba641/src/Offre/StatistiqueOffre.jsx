import React, { Component, useEffect } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';

import espritNetwork from "../assets/logo-network.png";
class StatistiqueOffre extends Component {
  state = {
    data: [],
    loading: true,
    error: null,
    pourcentageData: [], 
    companiesData: [], 
    pourcentagePostule: [],
    candidatData: [],
    searchQuery: '',
    searchQueryCompany: ''
  };

  componentDidMount() {
    axios.get('http://localhost:3000/offre/statistiques/competences')
      .then(response => {
        this.setState({ data: response.data, loading: false });
      })
      .catch(error => {
        this.setState({ error: error.message, loading: false });
      });

    axios.get('http://localhost:3000/vue/getStatistiquesCompetences')
      .then(response => {
        this.setState({ pourcentageData: response.data });
      })
      .catch(error => {
        console.error('Error fetching pourcentage statistics:', error);
      });

    axios.get('http://localhost:3000/offre/getActifCompany')
      .then(response => {
        this.setState({ companiesData: response.data });
      })
      .catch(error => {
        console.error('Error fetching active companies data:', error);
      });

    axios.get('http://localhost:3000/offre/getActifCondidat')
      .then(response => {
        this.setState({ candidatData: response.data });
      })
      .catch(error => {
        console.error('Error fetching active candidates data:', error);
      });

    axios.get('http://localhost:3000/offre/getCompetenceByPostuleCompany')
      .then(response => {
        this.setState({ pourcentagePostule: response.data });
      })
      .catch(error => {
        console.error('Error fetching pourcentage statistics:', error);
      });

  }
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };
  handleCompanySearchChange = (event) => {
    this.setState({ searchQueryCompany: event.target.value });
  };

  render() {
    const { data, loading, error, pourcentageData, companiesData, pourcentagePostule, searchQuery, candidatData, searchQueryCompany } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const chartData = [['Compétence', 'Nombre d\'offres'], ...data.map(item => [item.competence, item.count])];

    const pourcentageChartData = [['Compétence', 'Pourcentage']];
    pourcentageData.forEach(item => {
      pourcentageChartData.push([item.competence, item.pourcentage]);
    });

    const chartDataPostule = [['Compétence', 'Pourcentage']];
    pourcentagePostule.forEach(item => {
      chartDataPostule.push([item.competence, parseFloat(item.percentage)]);

    });

    const filteredCandidatData = candidatData.filter(candidat =>
      candidat.candidatName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const filteredCompaniesData = companiesData.filter(company =>
      company.companyName.toLowerCase().includes(searchQueryCompany.toLowerCase())
    );


    return (
      <section id="services" className="section" data-aos="fade-up">
        <div className="container">
          <div className="section-title">
            <h2 className="text-black">Statistique Offre</h2>
          </div>
          <div className="row">

            <div className="col-lg-12">
              {data.length === 0 ? (
                <p>Aucune donnée disponible pour afficher le graphique.</p>
              ) : (
                <Chart
                  width={'100%'}
                  height={'400px'}
                  chartType="BarChart"
                  loader={<div>Loading Chart</div>}
                  data={chartData}
                  options={{
                    title: "Statistiques affichant le nombre d'offres par compétence.",
                    chartArea: { width: '50%' },
                    hAxis: {
                      title: 'Nombre d\'offres',
                      minValue: 0,
                    },
                    vAxis: {
                      title: 'Compétence',
                    },
                  }}
                />
              )}
            </div>



            <hr></hr>
            <div className="col-lg-12">
              <Chart
                width={'100%'}
                height={'400px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={pourcentageChartData}
                options={{
                  title: 'Statistiques des compétences les plus visibles par pourcentage.',
                }}
              />
            </div>


            <hr></hr>
            <div className="col-lg-12">
              {pourcentagePostule.length === 0 ? (
                <p>Aucune donnée disponible pour afficher le graphique des compétences les plus postulées par pourcentage.</p>
              ) : (
                <Chart
                  width={'100%'}
                  height={'400px'}
                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={chartDataPostule}
                  options={{
                    title: 'Statistiques des compétences les plus postulées par pourcentage.',
                    chartArea: { width: '50%' },
                    hAxis: {
                      title: 'Pourcentage',
                    },
                    vAxis: {
                      title: 'Compétence',
                      minValue: 0,
                    },
                  }}
                />
              )}
            </div>


            <hr></hr>


            <div className="col-lg-12">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="card-title">Entreprises Actives (classées par activité)</h2>
                  <p className="card-text">Ci-dessous se trouve la liste des entreprises classées par leur niveau d'activité, avec les entreprises les plus actives en tête de liste.</p>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Rechercher une entreprise..."
                    value={searchQueryCompany}
                    onChange={this.handleCompanySearchChange}
                  />
                  <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {filteredCompaniesData.length === 0 ? (
                      <p>Aucune entreprise trouvée.</p>
                    ) : (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Image</th>
                            <th scope="col">Nom de la société</th>
                            <th scope="col">Nombre d'offres</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCompaniesData.map((company, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                {company.companyImage ? (
                                  <img
                                    src={company.companyImage}
                                    className="rounded-circle"
                                    alt="Logo de la société"
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={espritNetwork} 
                                    className="card-img-top"
                                    alt="Image de société"
                                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                                  />
                                )}
                              </td>
                              <td>{company.companyName}</td>
                              <td>{company.numberOfOffers}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>


            <hr></hr>

            <div className="col-lg-12">
              <div className="card shadow">
                <div className="card-body">
                  <h2 className="card-title">Candidats Actifs (classés par activité)</h2>
                  <p className="card-text">Ci-dessous se trouve la liste des candidats classés par leur niveau d'activité, avec les candidats les plus actifs en tête de liste.</p>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Rechercher un candidat..."
                    value={searchQuery}
                    onChange={this.handleSearchChange}
                  />
                  <div className="table-responsive custom-scrollbar" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Image</th>
                          <th scope="col">Nom du candidat</th>
                          <th scope="col">Nombre de candidatures</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCandidatData.map((candidat, index) => (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>
                              {candidat.candidatImage ? (
                                <img
                                  src={candidat.candidatImage}
                                  className="rounded-circle"
                                  alt="Image du candidat"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                  }}
                                />
                              ) : (
                                <img
                                  src="public/assets/img/team/avatar.jpg"
                                  className="rounded-circle"
                                  alt="Image par défaut"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                  }}
                                />
                              )}
                            </td>
                            <td>{candidat.candidatName}</td>
                            <td>{candidat.numberOfCandidacies}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default StatistiqueOffre;
