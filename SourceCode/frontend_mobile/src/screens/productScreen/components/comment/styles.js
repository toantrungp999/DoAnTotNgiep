import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 100,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  rowEdit: {
    flexDirection: 'row',
    width: '100%',
  },
  img: {
    width: '15%',
  },
  avartar: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 2,
  },
  addComment: {
    width: '75%',
    marginBottom: 5,
  },
  addReply: {
    width: '85%',
    marginBottom: 5,
  },
  sendReply: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editComent: {
    width: '84%',
    marginBottom: 5,
  },
  viewSend: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewEditAction: {
    width: '16%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    fontSize: 16,
    color: 'rgb(0,119,212)',
  },
  editBtn: {
    marginLeft: 20,
    fontSize: 16,
    color: 'rgb(0,119,212)',
  },
  contentArea: {
    width: '85%',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    minHeight: 45,
  },
  name: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: 'black',
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
  },
  input: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 20,
    height: 30,
    fontSize: 13,
    backgroundColor: 'white',
    color: 'black',
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    width: '100%',
  },
  areaAction: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 5,
    marginLeft: 10,
  },
  textAction: {
    fontSize: 12,
    color: 'rgb(0,119,212)',
    marginLeft: 10,
  },
  avartarReply: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop: 3,
  },
  imgReply: {
    width: '16%',
  },
});

export default styles;
