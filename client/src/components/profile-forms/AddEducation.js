import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addEducation } from '../../actions/profile';

const AddEducation = ({ addEducation }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldOfStudy: '',
        from: '',
        to: '',
        current: false,
        description: '',
    });

    const { school, degree, fieldOfStudy, from, to, current, description } =
        formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        addEducation(formData, navigate);
    };

    return (
        <Fragment>
            <h1 className='large text-primary'>Add An Education</h1>
            <p className='lead'>
                <i className='fas fa-code-branch'></i> Add any school or
                bootcamp that you have attended
            </p>
            <small>* = required field</small>
            <form className='form' onSubmit={(e) => onSubmit(e)}>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* School or Bootcamp'
                        name='school'
                        required
                        value={school}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='* Degree'
                        name='degree'
                        required
                        value={degree}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className='form-group'>
                    <input
                        type='text'
                        placeholder='Field of Study'
                        name='fieldOfStudy'
                        value={fieldOfStudy}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className='form-group'>
                    <h4>From Date</h4>
                    <input
                        type='date'
                        name='from'
                        value={from}
                        onChange={(e) => onChange(e)}
                    />
                </div>
                <div className='form-group'>
                    <p>
                        <input
                            type='checkbox'
                            name='current'
                            checked={current}
                            value={current}
                            onChange={(e) => {
                                setFormData({ ...formData, current: !current });
                            }}
                        />{' '}
                        Currently attending
                    </p>
                </div>
                <div className='form-group'>
                    <h4>To Date</h4>
                    <input
                        type='date'
                        name='to'
                        value={to}
                        onChange={(e) => onChange(e)}
                        disabled={current}
                    />
                </div>
                <div className='form-group'>
                    <textarea
                        name='description'
                        cols='30'
                        rows='5'
                        placeholder='Education Description'
                        value={description}
                        onChange={(e) => onChange(e)}
                    ></textarea>
                </div>
                <input type='submit' className='btn btn-primary my-1' />
                <Link className='btn btn-light my-1' to='/dashboard'>
                    Go Back
                </Link>
            </form>
        </Fragment>
    );
};

AddEducation.propTypes = {
    addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
