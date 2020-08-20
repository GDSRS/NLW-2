import React, { useState, useEffect, FormEvent } from 'react';
import { AxiosResponse } from 'axios';

import PageHeader from '../../components/PageHeader';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import { useAuth } from '../../contexts/auth';
import warningIcon from '../../assets/images/icons/warning.svg'
import Select from '../../components/Select'
import api from '../../services/api';
import classesJson from '../../resources/classes.json'
import week_days from '../../resources/week_days.json'
import convertMinutesToHours from '../../utils/convertMinutesToHour'
import cameraIcon from '../../assets/images/icons/camera-icon.svg'

import './styles.css'

interface ClassesInterface {
  id?: number;
  subject: string;
  cost: string;
  teacher_id?: number;
  schedules: {
    week_day: string;
    from: number | string;
    to: number | string;
    class_id?: number;
  }[];
}

interface TeacherInfoInterface {
  whatsapp: string;
  bio: string;
  subject: string;
  classes: ClassesInterface[]
}

function Profile() {

  const { user } = useAuth()
  const [name, setName] = useState('');
  const [last_name, setLastName] = useState('');
  const [avatar, setAvatar] = useState('');

  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [classes, setClasses] = useState([{}] as ClassesInterface[])


  useEffect(() => {
    getTeacherInfo()
    console.log('USE EFFECT')
    setUserInformation()
  }, [])


  async function updateUserInfo() {
    const response = await api.put('/update-user', {
      name,
      last_name,
      avatar
    })

    return response.status
  }

  async function updateTeacherInfo() {
    const response = await api.put('/update-teacher', {
      whatsapp,
      bio,
      classes
    })

    return response.status
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    var status = await updateUserInfo();
    if (status === 204) {
      console.log(status)
      status = await updateTeacherInfo();
      if (status !== 204)
        console.log('Error while updating teacher information')
    }
    else
      console.log('Error while updating user information')
  }

  function setUserInformation() {
    if (user !== null) {
      setName(user.name)
      setLastName(user.last_name)
      setAvatar(user.avatar)
    }
  }

  function setTeacherInformation(response: AxiosResponse<TeacherInfoInterface>) {
    /* Set local variables with teacher information */
    convertTimesInSchedule(response.data.classes)
    setBio(response.data.bio)
    setWhatsapp(response.data.whatsapp)
  }

  async function getTeacherInfo() {
    const response = await api.get('/teacher-info')
    setTeacherInformation(response)
  }

  function convertTimesInSchedule(classesObj: ClassesInterface[]) {
    const updatedClasses = classesObj.map(cls => {
      const updatedSchedules = cls.schedules?.map(schedule => {
        return {
          week_day: schedule.week_day,
          from: convertMinutesToHours(schedule.from),
          to: convertMinutesToHours(schedule.to)
        }
      })
      return { ...cls, schedules: updatedSchedules }
    })
    setClasses(updatedClasses)
  }

  function updateClassField(updatedIndex: number, value: string | object, field: string) {
    const newClasses = classes.map((cls, index) => {
      if (index === updatedIndex) {
        return { ...cls, [field]: value }
      }
      return cls
    })
    setClasses(newClasses)
  }

  function updateClassSchedule(classIndex: number, scheduleIndex: number,
    field: string, value: string) {
    var newSchedules = classes[classIndex].schedules.map((schedule, index) => {
      if (scheduleIndex === index) {
        return { ...schedule, [field]: value }
      }
      return schedule
    })

    updateClassField(classIndex, newSchedules, 'schedules')
  }

  return (
    <div id="profile-page">
      <div id="profile-content" className="container">

        <PageHeader topTitle="Meu perfil">
          <div id="user-presentation">
            <div id="user-basic-info">
              <img
                src={cameraIcon}
                alt='editar foto de perfil'
                onClick={() => console.log('Click')}
              />
              <img
                src={avatar ? avatar : "http://github.com/GDSRS.png"}
                alt='foto de perfil'
              />
            </div>
            <h3>{name} {last_name}</h3>
            {classes?.map((cls, index) => {
              return <p key={index}>{cls.subject}</p>
            })}
          </div>
        </PageHeader>

        <main>
          <form onSubmit={handleSubmit}>
            <fieldset>
              <legend>Seus dados</legend>
              <div className="teacher-info-name">
                <Input name="name"
                  id="name"
                  label="Nome"
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                />

                <Input name="last_name"
                  id="last_name"
                  label="Sobrenome"
                  value={last_name}
                  onChange={(e) => { setLastName(e.target.value) }}
                />

              </div>

              <div className="teacher-info-contact">
                <Input name="email"
                  id="email"
                  label="E-mail"
                  value={user?.email || ''}
                  readOnly
                />

                <Input
                  name="whatsapp"
                  id="whatsapp"
                  value={whatsapp}
                  label="Whatsapp"
                  onChange={(e) => { setWhatsapp(e.target.value) }}
                />
              </div>

              <Textarea
                name="bio"
                id="bio"
                value={bio}
                label="Biografia"
                onChange={(e) => { setBio(e.target.value) }}
              />
            </fieldset>


            {classes?.map((cls, index) => {
              return (
                <React.Fragment key={index}>
                  <fieldset>
                    <legend>Sobre a aula</legend>
                    <div className='class-info'>
                      <Select
                        name="subject"
                        value={cls.subject}
                        label="Matéria"
                        options={classesJson}
                        onChange={(e) => { updateClassField(index, e.target.value, 'subject') }}
                      />
                      <Input
                        name="cost"
                        value={cls.cost || ''}
                        prefix="çalskdfjçalskdj"
                        label="Custo da sua hora por aula"
                        onChange={(e) => { updateClassField(index, e.target.value, 'cost') }}
                      />
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend>
                      Horários disponíveis
                      <button type="button" onClick={() => { }}>
                        + Novo Horário
                      </button>
                    </legend>
                    {cls.schedules?.map((scheduleItem, scheduleIndex) => {
                      return (
                        <div key={scheduleItem.week_day} className="schedule-item">
                          <Select
                            name="week_day"
                            value={scheduleItem.week_day}
                            label="Dia da semana"
                            options={week_days}
                            onChange={e => updateClassSchedule(index, scheduleIndex, "week_day", e.target.value)}
                          />
                          <Input
                            name="from"
                            label="Das"
                            type="time"
                            value={scheduleItem.from}
                            onChange={e => updateClassSchedule(index, scheduleIndex, "from", e.target.value)}
                          />
                          <Input
                            name="to"
                            label="Até"
                            type="time"
                            value={scheduleItem.to}
                            onChange={e => updateClassSchedule(index, scheduleIndex, "to", e.target.value)}
                          />
                        </div>
                      );
                    })}
                  </fieldset>
                </React.Fragment>
              );
            })}

            <footer>
              <p>
                <img src={warningIcon} alt="Aviso importante" />
                Importante! <br />
                Preencha todos os dados
              </p>
              <button type='submit'>
                Salvar Cadastro
              </button>
            </footer>
          </form>
        </main>

      </div>
    </div>
  );
}

export default Profile;