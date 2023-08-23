import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {FlexBox} from "../utility/alignment.components";
import {Button} from "../utility/button.component";
import {Tooltip} from "../utility/tooltip.component";
import {motion} from "framer-motion";
import {Spinner} from "../utility/loader.component";


/*
L1 : Name,
L2: Type of Work
L3 Identification,
L4 Description
 */

interface FormInterface {
    name: string,
    type: string,
    Id: {
        type: 'NS' | 'PC' | 'AC' | 'CN' | string,
        value: string
    },
    description: string,
    Images: string[]
}

export function WorkerForm({handleFormSubmit, formValues}: {
    handleFormSubmit: () => void,
    formValues?: FormInterface
}) {
    let [image, setImage] = useState<string[] | []>([])
    const [showId, setShowId] = useState(false)
    const [IdType, setIdType] = useState<'CN' | 'AC' | 'PC'>('CN')
    const [loading, setLoading] = useState(false);
    const [workerFormValues, UpdateWokerForm] = useState<FormInterface>({
        name: '',
        type: '',
        Id: {
            type: '',
            value: ''
        },
        description: '',
        Images: []
    })
    const [error, setError] = useState<string[]>([])
    const handleImageEvent = (event: any) => {
        Array.from(event.target.files).map((file: any) => {
            let reader = new FileReader();
            let baseString: string | ArrayBuffer | null;
            reader.onloadend = function () {
                baseString = reader.result;
                if (typeof baseString === "string") {
                    let ImgSet: string[] = image;
                    ImgSet.push(baseString);
                    setImage([...image, baseString]);
                    handleFormUpdate({key:'images',value:''})
                }
            }
            reader.readAsDataURL(file);
        })

    }

    function handleRemove(img: string): void {
        let ImgSet = image;
        let newSet: string[] = [];
        ImgSet.map(item => {
            if (item != img) newSet.push(item)
        });
        setImage(newSet);
    }

    function handleSelect(event: any) {
        handleFormUpdate({key:'id',value:event.target.value})
        if (event.target.value === 'NS') setShowId(false);
        else {
            if (event.target.value === 'AC') setIdType('AC');
            if (event.target.value === 'PC') setIdType('PC');
            if (event.target.value === 'CN') setIdType('CN')
            setShowId(true)
        }
    }

    function handleIDPlaceHolderValue(): string {
        if (IdType === 'AC') return '1122-XXXX-2233-XXXX';
        if (IdType === 'PC') return 'HCPPXXXXXX';
        if (IdType === 'CN') return '9650XXXXX1';
        else return ''
    }

    function handleError(type: 'L1' | 'L2' | 'L3' | 'L4'): boolean {
        switch (type) {
            case "L1":
                return error.includes('L1');
                break
            case "L2":
                return error.includes('L2');
                break
            case "L3":
                return error.includes('L3');
                break
            case "L4":
                return error.includes('L4');
                break
            default :
                return false;
        }

    }

    function handleFormUpdate({key, value}: { key: string, value: string }) {
        switch (key) {
            case 'name':
                UpdateWokerForm({...workerFormValues, name: value});
                break;
            case 'type' :
                UpdateWokerForm({...workerFormValues, type: value});
                break;
            case 'id' :
                UpdateWokerForm({...workerFormValues, Id: {...workerFormValues.Id, type: value}});
                break;
            case 'idvalue' :
                UpdateWokerForm({...workerFormValues, Id: {...workerFormValues.Id, value: value}});
                break;
            case 'description' :
                UpdateWokerForm({...workerFormValues, description: value});
                break;
            case 'images' :
                UpdateWokerForm({...workerFormValues, Images: [...image]});
                break;
            default : {};
        }
    }

    console.log(workerFormValues)
    return (
        <WorkerFormWrapper>
            <WorkerFormContainer>
                <FlexBox flexDirection={'row'} justifyContent={'space-between'}>
                    <FlexBox flexDirection={'column'} justifyContent={'flex-start'}>
                        <HeaderText>Name of Worker</HeaderText>
                        <InputField border={handleError('L1') && 'red' || undefined} initial={{opacity: 0}}
                                    animate={{x: 10, opacity: 1}}
                                    transition={{stiffness: 50, delay: 0.1, opacity: 0}} style={{width: '400px'}}
                                    placeholder={'Wasim'}
                        onInput={(e:any)=>{handleFormUpdate({key:'name',value:e?.target?.value && e.target.value || ''})}}
                        />
                    </FlexBox>
                    <FlexBox flexDirection={'column'} justifyContent={'flex-start'}
                             style={{justifyContent: 'center', alignItems: 'center'}}>
                        <PaddingContainer style={{padding: '10px 10px'}}>
                            <Button click={() => {
                                setLoading(true);
                                handleFormSubmit()
                            }} color={'whitesmoke'}>{!loading ? 'Save Worker Details' : Spinner('white')}</Button>
                        </PaddingContainer>
                    </FlexBox>
                </FlexBox>
                <HeaderText>Type of Work <Tooltip InfoEl={<div>What type of work was done by the worker.</div>}/>
                </HeaderText>
                <PaddingContainer><InputField
                    onInput={(e:any)=>{handleFormUpdate({key:'type',value:e?.target?.value && e.target.value || ''})}}
                    initial={{opacity: 0}}
                                              animate={{x: 10, opacity: 1}}
                                              transition={{stiffness: 50, delay: 0.1, opacity: 0}}
                                              placeholder={'Bought Air Conditioning'}
                                              border={handleError('L2') && 'red' || undefined}
                /></PaddingContainer>
                <FlexBox flexDirection={'row'} justifyContent={'space-around'}>
                    <div style={{width: '100%'}}>
                        <HeaderText>Identification Type</HeaderText>
                        <PaddingContainer>
                            <CustomSelect onChange={handleSelect}>
                                <option value={'NS'}>Not sure</option>
                                <option value={'AC'}>Adhar Card</option>
                                <option value={'CN'}>Contact Number</option>
                                <option value={'PC'}>Pan Card</option>
                            </CustomSelect>
                        </PaddingContainer>
                    </div>
                    {showId && <div style={{width: '100%'}}>
                        <HeaderText>Identification <Tooltip
                            InfoEl={<div>Identification is never saved within us or not showed to anyone, It's only to
                                validate the workers</div>}/> </HeaderText>
                        <PaddingContainer><InputField
                            onInput={(e:any)=>{handleFormUpdate({key:'idvalue',value:e?.target?.value && e.target.value || ''})}}
                            initial={{opacity: 0}}
                                                      animate={{x: 10, opacity: 1}}
                                                      transition={{stiffness: 50, delay: 0.1, opacity: 0}}
                                                      style={{width: '100%'}}
                                                      border={handleError('L3') && 'red' || undefined}
                                                      placeholder={handleIDPlaceHolderValue()}/></PaddingContainer>
                    </div>}

                </FlexBox>
                <HeaderText>Write some description about the work he has done</HeaderText>
                <PaddingContainer><InputArea
                    onInput={(e:any)=>{handleFormUpdate({key:'description',value:e?.target?.value && e.target.value || ''})}}
                    initial={{opacity: 0}}
                                             animate={{x: 10, opacity: 1}}
                                             transition={{stiffness: 50, delay: 0.1, opacity: 0}}
                                             border={handleError('L4') && 'red' || undefined}
                                             placeholder={'Please help others understand the  work he has been doing'}/></PaddingContainer>


                <FlexBox flexDirection={'row'} justifyContent={'flex-start'}
                         style={{margin: '20px 0', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <FlexBox flexDirection={'column'} justifyContent={'flex-start'}>
                        <HeaderText>Proof of work</HeaderText>
                        <InputField initial={{opacity: 0}}
                                    animate={{x: 10, opacity: 1}}
                                    transition={{stiffness: 50, delay: 0.1, opacity: 0}}
                                    style={{width: '120px', border: 'none'}} onInput={handleImageEvent} type={'file'}
                                    accept="image/png, image/gif, image/jpg"
                                    multiple={true} placeholder={'Alex'}/>
                    </FlexBox>

                    <FlexBox flexDirection={'row'} justifyContent={'flex-start'}>
                        {image.map((image: string) => (<ImageCollection image={image} handleRemove={handleRemove}/>))}
                    </FlexBox>
                </FlexBox>
            </WorkerFormContainer>
        </WorkerFormWrapper>
    )
}

function ImageCollection({image, handleRemove}: { image: string, handleRemove: (I: string) => void }) {
    return (
        <ImageContainer>
            <ImageFrame src={image} alt={'null'}/>
            <CustomButton onClick={() => {
                handleRemove(image)
            }}>Remove</CustomButton>
        </ImageContainer>
    )
}

const CustomSelect = styled(motion.select)`
  background: #202124;
  border-radius: 4px;
  border: 2px solid whitesmoke;
  height: 52px;
  width: 100%;
  color: whitesmoke;
  padding: 10px 6px;
  margin-left: 10px;


`;

const CustomButton = styled.div`
  color: #703232;
  border: 1px solid #703232;
  border-radius: 4px;
  padding: 2px 2px;
  text-align: center;
  width: fit-content;
  align-self: center;
  cursor: pointer;
`;

const ImageFrame = styled.img`
  height: 100%;
  width: 100%;
  margin: 0 10px;
  border-radius: 4px;

`;

const ImageContainer = styled.div`
  height: 140px;
  width: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 10px;
`;

const WorkerFormWrapper = styled.div`
  padding: 0 75px;
  width: 100%;
  overflow-x: scroll;
  height: 70vh;
`;
const WorkerFormContainer = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
`;
const InputField = styled(motion.input)<{ border?: string | undefined }>`
  border-radius: 4px;
  background: transparent;
  border: 2px solid ${props => props.border ? props.border : 'whitesmoke'};
  height: 40px;
  width: 100%;
  color: whitesmoke;
  padding: 6px;
`;

const InputArea = styled(motion.textarea)<{ border?: string | undefined }>`
  border-radius: 4px;
  background: transparent;
  border: 2px solid ${props => props.border ? props.border : 'whitesmoke'};
  width: 100%;
  height: 100px;
  color: whitesmoke;
  padding: 6px;

`;
const HeaderText = styled.div`
  color: whitesmoke;
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 15px;
`;

const PaddingContainer = styled.div`
  padding-right: 16px;
`;